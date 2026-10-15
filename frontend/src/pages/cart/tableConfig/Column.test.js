import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { cellTypes } from '@bento-core/table';
import { configColumn } from './Column';

const removeColumn = {
  dataField: 'remove',
  header: 'Remove',
  cellType: cellTypes.DELETE,
  headerType: cellTypes.DELETE,
  display: true,
  tooltipText: 'Remove an entry from the cart.',
};

const [configured] = configColumn({
  columns: [removeColumn],
  deleteCartFile: jest.fn(),
});

let toggleDialog;

beforeEach(() => {
  toggleDialog = jest.fn();
});

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(configured.customColHeaderRender(toggleDialog));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('should render the Remove column header label', () => {
    render(configured.customColHeaderRender(toggleDialog));

    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('should render the Remove header as plain text with no interactive control', () => {
    const { container } = render(configured.customColHeaderRender(toggleDialog));

    expect(container.textContent).toBe('Remove');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('should never ask the table package to open its bulk-removal dialog', () => {
    render(configured.customColHeaderRender(toggleDialog));

    expect(toggleDialog).not.toHaveBeenCalled();
  });
});
