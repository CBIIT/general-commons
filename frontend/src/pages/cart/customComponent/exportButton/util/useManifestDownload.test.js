import React from 'react';
import { render, act } from '@testing-library/react';
import gql from 'graphql-tag';
import { CartContext, downloadJson } from '@bento-core/cart';
import { useManifestDownload } from './useManifestDownload';

const mockQuery = jest.fn();

jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({ query: (...args) => mockQuery(...args) }),
}));

jest.mock('@bento-core/cart', () => ({
  ...jest.requireActual('@bento-core/cart'),
  downloadJson: jest.fn(),
}));

const TABLE_QUERY = gql`
  query table {
    filesInList {
      file_id
    }
  }
`;

const MANIFEST_QUERY = gql`
  query manifest {
    filesInList {
      file_id
      file_name
    }
  }
`;

const buildCart = (overrides = {}) => ({
  table: {
    api: TABLE_QUERY,
    manifestAPI: MANIFEST_QUERY,
    columns: [{ dataField: 'file_id', appendString: 'drs://nci-crdc.datacommons.io/' }, { dataField: 'file_name' }],
  },
  queryVariables: { file_ids: ['file-1', 'file-2'] },
  manifestFileName: 'GC File Manifest',
  comment: 'Files for the spring cohort',
  ...overrides,
});

// @testing-library/react 12 has no renderHook, so the hook is captured through a probe component.
let hook;
const Probe = () => {
  hook = useManifestDownload();
  return null;
};

let cart;

const wrapper = ({ children }) => <CartContext.Provider value={{ context: { cart } }}>{children}</CartContext.Provider>;

const downloadManifest = async () => {
  let result;
  await act(async () => {
    result = await hook.downloadManifest();
  });
  return result;
};

beforeEach(() => {
  cart = buildCart();
  mockQuery.mockReset();
  mockQuery.mockResolvedValue({
    data: {
      filesInList: [
        { file_id: 'file-1', file_name: 'reads.bam' },
        { file_id: 'file-2', file_name: 'calls.vcf' },
      ],
    },
  });
  downloadJson.mockReset();
});

describe('useManifestDownload', () => {
  it('should query the manifest API when the table defines one', async () => {
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery.mock.calls[0][0].query).toBe(MANIFEST_QUERY);
  });

  it('should fall back to the table API when no manifest API is defined', async () => {
    cart.table = { ...cart.table, manifestAPI: undefined };
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(mockQuery.mock.calls[0][0].query).toBe(TABLE_QUERY);
  });

  it('should request every cart file in a single page', async () => {
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(mockQuery.mock.calls[0][0].variables).toEqual({
      file_ids: ['file-1', 'file-2'],
      offset: 0,
      first: 10000,
    });
  });

  it('should prefix only the columns that define an appendString', async () => {
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(downloadJson.mock.calls[0][0].tableData).toEqual([
      { file_id: 'drs://nci-crdc.datacommons.io/file-1', file_name: 'reads.bam' },
      { file_id: 'drs://nci-crdc.datacommons.io/file-2', file_name: 'calls.vcf' },
    ]);
  });

  it('should leave the query result untouched', async () => {
    const records = [{ file_id: 'file-1', file_name: 'reads.bam' }];
    mockQuery.mockResolvedValue({ data: { filesInList: records } });
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(records[0].file_id).toBe('file-1');
  });

  it('should pass the rest of the cart through to the download', async () => {
    render(<Probe />, { wrapper });

    await downloadManifest();

    expect(downloadJson).toHaveBeenCalledTimes(1);
    expect(downloadJson.mock.calls[0][0]).toMatchObject({
      manifestFileName: cart.manifestFileName,
      comment: cart.comment,
      queryVariables: cart.queryVariables,
      table: cart.table,
    });
  });

  it('should resolve with the result of the download', async () => {
    downloadJson.mockReturnValue('downloaded');
    render(<Probe />, { wrapper });

    expect(await downloadManifest()).toBe('downloaded');
  });

  it('should report a failure instead of rejecting when the query fails', async () => {
    mockQuery.mockRejectedValue(new Error('network down'));
    render(<Probe />, { wrapper });

    expect(hook.failed).toBe(false);

    await downloadManifest();

    expect(hook.failed).toBe(true);
    expect(downloadJson).not.toHaveBeenCalled();
  });

  it('should clear the failure once a retry succeeds', async () => {
    mockQuery.mockRejectedValueOnce(new Error('network down'));
    render(<Probe />, { wrapper });

    await downloadManifest();
    await downloadManifest();

    expect(hook.failed).toBe(false);
    expect(downloadJson).toHaveBeenCalledTimes(1);
  });

  it('should clear the failure when it is dismissed', async () => {
    mockQuery.mockRejectedValue(new Error('network down'));
    render(<Probe />, { wrapper });

    await downloadManifest();
    act(() => hook.dismissFailure());

    expect(hook.failed).toBe(false);
  });
});
