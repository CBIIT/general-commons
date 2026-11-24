import { useContext, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { CartContext, downloadJson } from '@bento-core/cart';

const MANIFEST_PAGE_SIZE = 10000;

/**
 * Custom hook to download the manifest for the current cart context.
 */
export const useManifestDownload = () => {
  const { context } = useContext(CartContext);
  const client = useApolloClient();
  const [failed, setFailed] = useState(false);

  const downloadManifest = async () => {
    const { cart } = context;
    const { table, queryVariables } = cart;

    let data;
    try {
      ({ data } = await client.query({
        query: table.manifestAPI ? table.manifestAPI : table.api,
        variables: { ...queryVariables, offset: 0, first: MANIFEST_PAGE_SIZE },
      }));
    } catch (error) {
      setFailed(true);
      return undefined;
    }
    setFailed(false);

    const columnsToAppendString = table.columns.filter((column) => column.appendString);
    const tableData = data.filesInList.map((record) => {
      const updatedRecord = { ...record };
      columnsToAppendString.forEach(({ dataField, appendString }) => {
        updatedRecord[dataField] = appendString + updatedRecord[dataField];
      });
      return updatedRecord;
    });

    return downloadJson({ ...cart, tableData });
  };

  return { downloadManifest, failed, dismissFailure: () => setFailed(false) };
};
