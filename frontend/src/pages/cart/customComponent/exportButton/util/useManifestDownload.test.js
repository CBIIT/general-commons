import React from 'react';
import { render } from '@testing-library/react';
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
const renderDownload = (cart) => {
  let download;
  const Probe = () => {
    download = useManifestDownload();
    return null;
  };
  render(
    <CartContext.Provider value={{ context: { cart }, dispatch: jest.fn() }}>
      <Probe />
    </CartContext.Provider>,
  );
  return download;
};

beforeEach(() => {
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
    await renderDownload(buildCart())();

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery.mock.calls[0][0].query).toBe(MANIFEST_QUERY);
  });

  it('should fall back to the table API when no manifest API is defined', async () => {
    const cart = buildCart();
    cart.table = { ...cart.table, manifestAPI: undefined };

    await renderDownload(cart)();

    expect(mockQuery.mock.calls[0][0].query).toBe(TABLE_QUERY);
  });

  it('should request every cart file in a single page', async () => {
    await renderDownload(buildCart())();

    expect(mockQuery.mock.calls[0][0].variables).toEqual({
      file_ids: ['file-1', 'file-2'],
      offset: 0,
      first: 10000,
    });
  });

  it('should prefix only the columns that define an appendString', async () => {
    await renderDownload(buildCart())();

    expect(downloadJson.mock.calls[0][0].tableData).toEqual([
      { file_id: 'drs://nci-crdc.datacommons.io/file-1', file_name: 'reads.bam' },
      { file_id: 'drs://nci-crdc.datacommons.io/file-2', file_name: 'calls.vcf' },
    ]);
  });

  it('should leave the query result untouched', async () => {
    const records = [{ file_id: 'file-1', file_name: 'reads.bam' }];
    mockQuery.mockResolvedValue({ data: { filesInList: records } });

    await renderDownload(buildCart())();

    expect(records[0].file_id).toBe('file-1');
  });

  it('should pass the rest of the cart through to the download', async () => {
    const cart = buildCart();

    await renderDownload(cart)();

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

    await expect(renderDownload(buildCart())()).resolves.toBe('downloaded');
  });

  it('should not download when the query fails', async () => {
    mockQuery.mockRejectedValue(new Error('network down'));

    await expect(renderDownload(buildCart())()).rejects.toThrow('network down');
    expect(downloadJson).not.toHaveBeenCalled();
  });
});
