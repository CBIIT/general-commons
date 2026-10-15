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

const listColumn = {
  dataField: 'study_acronym',
  header: 'Study',
  cellType: cellTypes.CUSTOM_ELEM,
  headerType: cellTypes.CUSTOM_ELEM,
  display: true,
};

const plainColumn = {
  dataField: 'file_name',
  header: 'File Name',
  display: true,
};

const deleteCartFile = jest.fn();

const [configured, listConfigured, plainConfigured] = configColumn({
  columns: [removeColumn, listColumn, plainColumn],
  deleteCartFile,
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

  it('should delete the File from the Cart when a Remove cell is activated', () => {
    expect(configured.cellEventHandler).toBe(deleteCartFile);
  });

  it('should list every value of a list cell', () => {
    render(listConfigured.customCellRender({ label: ['ABC', 'XYZ'] }));

    expect(screen.getByText('ABC, XYZ')).toBeInTheDocument();
  });

  it('should truncate a list cell after five values', () => {
    render(listConfigured.customCellRender({ label: ['A', 'B', 'C', 'D', 'E', 'F'] }));

    expect(screen.getByText('A, B, C, D, E, ...')).toBeInTheDocument();
  });

  it('should render nothing for a custom cell whose value is not a list', () => {
    const { container } = render(listConfigured.customCellRender({ label: 'ABC' }));

    expect(container).toBeEmptyDOMElement();
  });

  it('should render nothing for a custom column header', () => {
    const { container } = render(listConfigured.customColHeaderRender({}));

    expect(container).toBeEmptyDOMElement();
  });

  it('should leave columns without a custom cell or header unchanged', () => {
    expect(plainConfigured).toBe(plainColumn);
  });
});
