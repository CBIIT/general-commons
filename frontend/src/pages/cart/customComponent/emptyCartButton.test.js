import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Provider } from 'react-redux';
import { onDeleteAllCartFile } from '@bento-core/cart';
import EmptyCartButton from './emptyCartButton';

let filesId;
let dispatched;

const store = {
  getState: () => ({ cartReducer: { filesId } }),
  subscribe: () => () => {},
  dispatch: (action) => {
    dispatched.push(action);
    return action;
  },
};

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

beforeEach(() => {
  filesId = ['file-1', 'file-2'];
  dispatched = [];
});

const getEmptyCartButton = () => screen.getByRole('button', { name: /empty cart/i });

const openDialog = () => {
  fireEvent.click(getEmptyCartButton());
  return screen.getByRole('dialog');
};

describe('Accessibility', () => {
  it('should have no accessibility violations with the dialog closed', async () => {
    const { container } = render(<EmptyCartButton />, { wrapper });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with the dialog open', async () => {
    render(<EmptyCartButton />, { wrapper });

    const dialog = openDialog();

    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('should render without crashing', () => {
    render(<EmptyCartButton />, { wrapper });
  });

  it('should label the control Empty Cart', () => {
    render(<EmptyCartButton />, { wrapper });

    expect(getEmptyCartButton()).toBeInTheDocument();
  });

  it('should stay rendered but disabled when the Cart holds no Files', () => {
    filesId = [];
    render(<EmptyCartButton />, { wrapper });

    expect(getEmptyCartButton()).toBeInTheDocument();
    expect(getEmptyCartButton()).toBeDisabled();
  });

  it('should be enabled when the Cart holds Files', () => {
    render(<EmptyCartButton />, { wrapper });

    expect(getEmptyCartButton()).toBeEnabled();
  });

  it('should not show the dialog until the control is activated', () => {
    render(<EmptyCartButton />, { wrapper });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open the confirmation dialog when the control is activated', () => {
    render(<EmptyCartButton />, { wrapper });

    expect(openDialog()).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('should name the action and state its scope in the dialog', () => {
    render(<EmptyCartButton />, { wrapper });

    openDialog();

    expect(screen.getByText('Remove all items from cart?')).toBeInTheDocument();
    expect(screen.getByText('This will remove every item currently in your cart.')).toBeInTheDocument();
  });

  it('should offer Cancel before Remove All Items', () => {
    render(<EmptyCartButton />, { wrapper });

    const dialog = openDialog();

    const labels = Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent);
    expect(labels).toEqual(['Cancel', 'Remove All Items']);
  });

  it('should label and describe the dialog with its own title and body', () => {
    render(<EmptyCartButton />, { wrapper });

    const dialog = openDialog();

    expect(dialog).toHaveAccessibleName('Remove all items from cart?');
    expect(dialog).toHaveAccessibleDescription('This will remove every item currently in your cart.');
  });

  it('should put initial focus on Cancel', () => {
    render(<EmptyCartButton />, { wrapper });

    openDialog();

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('should leave the Cart untouched when the dialog is cancelled', () => {
    render(<EmptyCartButton />, { wrapper });

    openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(dispatched).toEqual([]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should empty the Cart and close when the removal is confirmed', () => {
    render(<EmptyCartButton />, { wrapper });

    openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Remove All Items' }));

    expect(dispatched).toEqual([onDeleteAllCartFile()]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should cancel on Escape without emptying the Cart', () => {
    render(<EmptyCartButton />, { wrapper });

    const dialog = openDialog();
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(dispatched).toEqual([]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should cancel on a click outside the dialog without emptying the Cart', () => {
    render(<EmptyCartButton />, { wrapper });

    const backdropTarget = openDialog().parentElement;
    fireEvent.mouseDown(backdropTarget);
    fireEvent.mouseUp(backdropTarget);

    expect(dispatched).toEqual([]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should show no follow-up message after the Cart is emptied', () => {
    render(<EmptyCartButton />, { wrapper });

    openDialog();
    fireEvent.click(screen.getByRole('button', { name: 'Remove All Items' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
