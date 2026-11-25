import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { CartContext, downloadJson } from '@bento-core/cart';
import ExportButton from './exportButtonController';

const mockQuery = jest.fn();
const mockUseQuery = jest.fn();
const mockGetManifestData = jest.fn();

jest.mock('@apollo/client', () => ({
  useQuery: (...args) => mockUseQuery(...args),
  useApolloClient: () => ({ query: (...args) => mockQuery(...args) }),
}));

jest.mock('@bento-core/cart', () => ({
  ...jest.requireActual('@bento-core/cart'),
  downloadJson: jest.fn(),
}));

jest.mock('./util/TableService', () => ({
  getManifestData: (...args) => mockGetManifestData(...args),
}));

jest.mock('../../../../bento/fileCentricCartWorkflowData', () => ({
  manifestData: { keysToInclude: ['file_id', 'file_name', 'study_acronym'], header: ['drs_uri', 'name', 'study'] },
  myFilesPageData: { tooltipMessage: 'Choose Download Manifest from the Export and Download menu.' },
}));

const MANIFEST_QUERY = gql`
  query manifest {
    filesInList {
      file_id
    }
  }
`;

const CART_COMMENT = 'Files for the spring cohort';

const TOOLTIP_ENTER_DELAY_MS = 250;

const cartState = {
  table: {
    api: MANIFEST_QUERY,
    manifestAPI: MANIFEST_QUERY,
    columns: [{ dataField: 'file_id', appendString: 'drs://nci-crdc.datacommons.io/' }, { dataField: 'file_name' }],
  },
  manifestData: {
    keysToInclude: ['file_id', 'file_name'],
    header: ['drs_uri', 'name'],
  },
  manifestFileName: 'GC File Manifest',
  queryVariables: { file_ids: ['file-1'] },
  comment: CART_COMMENT,
};

const store = {
  getState: () => ({ cartReducer: { filesId: ['file-1'] } }),
  subscribe: () => () => {},
  dispatch: jest.fn(),
};

const wrapper = ({ children }) => (
  <Provider store={store}>
    <CartContext.Provider value={{ context: { cart: cartState, dispatch: jest.fn() } }}>{children}</CartContext.Provider>
  </Provider>
);

const getExportButton = () => screen.getByRole('button', { name: /export and download/i });

// ClickAwayListener only arms itself on a macrotask after mount.
const flushTimers = async (ms = 0) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
};

const openMenu = async () => {
  fireEvent.click(getExportButton());
  await flushTimers();
};

beforeEach(() => {
  mockUseQuery.mockReset();
  mockUseQuery.mockReturnValue({ data: undefined });
  mockGetManifestData.mockReset();
  mockGetManifestData.mockReturnValue({ data: null });
  mockQuery.mockReset();
  mockQuery.mockResolvedValue({
    data: {
      filesInList: [{ file_id: 'file-1', file_name: 'reads.bam' }],
    },
  });
  downloadJson.mockReset();
});

describe('Accessibility', () => {
  it('should have no accessibility violations with the menu closed', async () => {
    const { container } = render(<ExportButton />, { wrapper });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with the menu open', async () => {
    const { container } = render(<ExportButton />, { wrapper });

    await openMenu();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('should render without crashing', () => {
    render(<ExportButton />, { wrapper });
  });

  it('should label the control Export and Download', () => {
    render(<ExportButton />, { wrapper });

    expect(getExportButton()).toBeInTheDocument();
  });

  it('should not show the menu options until the control is activated', () => {
    render(<ExportButton />, { wrapper });

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('should open the menu when the control is activated', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();

    expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);
  });
});

describe('Implementation Requirements', () => {
  let openSpy;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  it('should offer Export to Cancer Genomics Cloud first and Download Manifest second', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();

    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Export to Cancer Genomics Cloud',
      'Download Manifest',
    ]);
  });

  it('should download the Manifest when Download Manifest is chosen', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: /download manifest/i }));
    await flushTimers();

    expect(downloadJson).toHaveBeenCalledTimes(1);
    expect(downloadJson.mock.calls[0][0]).toMatchObject({
      manifestFileName: 'GC File Manifest',
      tableData: [
        {
          file_id: 'drs://nci-crdc.datacommons.io/file-1',
          file_name: 'reads.bam',
        },
      ],
    });
  });

  it("should carry the Cart's description into the downloaded Manifest", async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: /download manifest/i }));
    await flushTimers();

    expect(downloadJson.mock.calls[0][0].comment).toBe(CART_COMMENT);
  });

  it('should make the Manifest guidance reachable from the Download Manifest option', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.mouseOver(screen.getByRole('menuitem', { name: /download manifest/i }));
    await flushTimers(TOOLTIP_ENTER_DELAY_MS);

    expect(screen.getByRole('tooltip')).toHaveTextContent('Choose Download Manifest from the Export and Download menu.');
  });

  it('should open the Cancer Genomics Cloud destination when that option is chosen', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(
      screen.getByRole('menuitem', {
        name: /export to cancer genomics cloud/i,
      }),
    );

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toContain('https://cgc.sbgenomics.com/import-redirect/drs/csv');
  });

  it('should close the menu after an option is chosen', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(
      screen.getByRole('menuitem', {
        name: /export to cancer genomics cloud/i,
      }),
    );

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('should close the menu on click-away', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(document.body);

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('should close the menu when focus tabs out of it', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('should keep the menu open on keys other than Tab', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('should close the menu when the control is activated again', async () => {
    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(getExportButton());

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('should not store a Manifest until the Cart files have loaded', () => {
    render(<ExportButton />, { wrapper });

    expect(mockUseQuery.mock.calls[0][1].skip).toBe(true);
  });

  it('should store a Manifest of the Cart files with DRS URIs', () => {
    mockGetManifestData.mockReturnValue({
      data: {
        filesInList: [
          { file_id: 'file-1', file_name: 'reads.bam', study_acronym: ['ABC', 'XYZ'] },
          { file_id: '', file_name: 'calls.vcf' },
        ],
      },
    });

    render(<ExportButton />, { wrapper });

    const { variables, skip } = mockUseQuery.mock.calls[0][1];
    expect(skip).toBe(false);
    expect(JSON.parse(variables.manifestString)).toEqual([
      { drs_uri: 'drs://nci-crdc.datacommons.io/file-1', name: 'reads.bam', study: 'ABC, XYZ' },
      { drs_uri: '', name: 'calls.vcf', study: '' },
    ]);
  });

  it('should send the stored Manifest URL to Cancer Genomics Cloud', async () => {
    const manifestUrl = 'https://bucket.s3.amazonaws.com/manifest.csv?X-Amz-Signature=abc&X-Amz-Expires=60';
    mockUseQuery.mockReturnValue({ data: { storeManifest: manifestUrl } });

    render(<ExportButton />, { wrapper });

    await openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: /export to cancer genomics cloud/i }));

    expect(openSpy).toHaveBeenCalledWith(
      `https://cgc.sbgenomics.com/import-redirect/drs/csv?URL=${encodeURIComponent(manifestUrl)}`,
      '_blank',
      'noopener,noreferrer',
    );
  });
});
