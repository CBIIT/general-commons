import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { onDeleteCartFile } from '@bento-core/cart';
import usePageTitle from '../../components/Analytics/usePageTitle';
import CartController from './cartController';

jest.mock('../../components/Analytics/usePageTitle', () => jest.fn());

jest.mock('@bento-core/paginated-table', () => ({
  TableContextProvider: ({ children }) => children,
}));

jest.mock('../../bento/fileCentricCartWorkflowData', () => ({
  table: { title: 'Cart Table' },
}));

jest.mock('./cartView', () => ({ filesId, config, deleteCartFile }) => (
  <div>
    <span>{`${filesId.length} files in ${config.title}`}</span>
    <button type="button" onClick={() => deleteCartFile({ file_id: 'file-2', file_name: 'calls.vcf' })}>
      Remove calls.vcf
    </button>
  </div>
));

let dispatched;

const store = {
  getState: () => ({ cartReducer: { filesId: ['file-1', 'file-2'] } }),
  subscribe: () => () => {},
  dispatch: (action) => {
    dispatched.push(action);
    return action;
  },
};

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

beforeEach(() => {
  dispatched = [];
  usePageTitle.mockClear();
});

describe('Basic Functionality', () => {
  it('should title the page File Centric Cart', () => {
    render(<CartController />, { wrapper });

    expect(usePageTitle).toHaveBeenCalledWith('File Centric Cart');
  });

  it('should render the Cart table with the Cart files and table config', () => {
    render(<CartController />, { wrapper });

    expect(screen.getByText('2 files in Cart Table')).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('should remove a File from the Cart by its file_id', () => {
    render(<CartController />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: 'Remove calls.vcf' }));

    expect(dispatched).toEqual([onDeleteCartFile('file-2')]);
  });
});
