package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento.service.ESService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.opensearch.client.Request;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for the protocolOverview search.
 * The Elasticsearch query is built for real; the search response is stubbed.
 */
class PrivateESDataFetcherProtocolsOverviewTest {

    private ESService esService;
    private PrivateESDataFetcher fetcher;
    private ArgumentCaptor<Request> requestCaptor;
    private ArgumentCaptor<Map<String, Object>> queryCaptor;
    private ArgumentCaptor<Integer> pageSizeCaptor;
    private ArgumentCaptor<Integer> offsetCaptor;

    @BeforeEach
    void setUp() throws Exception {
        ConfigurationDAO config = mock(ConfigurationDAO.class);
        esService = spy(new ESService(config));
        fetcher = new PrivateESDataFetcher(esService, mock(MemgraphDataFetcher.class));

        requestCaptor = ArgumentCaptor.forClass(Request.class);
        queryCaptor = ArgumentCaptor.forClass(Map.class);
        pageSizeCaptor = ArgumentCaptor.forClass(Integer.class);
        offsetCaptor = ArgumentCaptor.forClass(Integer.class);
        doReturn(List.of()).when(esService).collectPage(
                requestCaptor.capture(),
                queryCaptor.capture(),
                any(String[][].class),
                pageSizeCaptor.capture(),
                offsetCaptor.capture()
        );
    }

    @Test
    void shouldSearchDashboardProtocolIndex() throws Exception {
        fetcher.protocolOverview(createBaseParams());

        assertEquals("/dashboard_protocol/_search", requestCaptor.getValue().getEndpoint());
        verify(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());
    }

    @Test
    void shouldFilterByFileIds() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("file_ids", List.of("dg.4DFC/70b67664-03d2-11ef-bc5a-139e96c5aecc"));

        fetcher.protocolOverview(params);

        assertTrue(hasTermsFilter(queryCaptor.getValue(), "file_ids",
                List.of("dg.4DFC/70b67664-03d2-11ef-bc5a-139e96c5aecc")));
    }

    @Test
    void shouldFilterByFiles() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("files", List.of("dg.4DFC/12345678"));

        fetcher.protocolOverview(params);

        assertTrue(hasTermsFilter(queryCaptor.getValue(), "files",
                List.of("dg.4DFC/12345678")));
    }

    @Test
    void shouldIgnoreEmptyFileFilters() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("file_ids", List.of());
        params.put("files", List.of());

        fetcher.protocolOverview(params);

        Map<String, Object> query = queryCaptor.getValue();
        assertFalse(hasTermsField(query, "file_ids"));
        assertFalse(hasTermsField(query, "files"));
    }

    @Test
    void shouldPassProtocolAndFileNameFilters() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("protocol_pk_id", List.of("70385678"));
        params.put("file_names", List.of("protocol.pdf"));

        fetcher.protocolOverview(params);

        Map<String, Object> query = queryCaptor.getValue();
        assertTrue(hasTermsFilter(query, "protocol_pk_id", List.of("70385678")));
        assertTrue(hasTermsFilter(query, "file_names", List.of("protocol.pdf")));
    }

    @Test
    void shouldSortByProtocolPkIdByDefault() throws Exception {
        fetcher.protocolOverview(createBaseParams());

        assertEquals(Map.of("protocol_pk_id", "asc"), queryCaptor.getValue().get("sort"));
    }

    @Test
    void shouldSortFileNamesBySortField() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("order_by", "file_names");
        params.put("sort_direction", "DESC");

        fetcher.protocolOverview(params);

        assertEquals(Map.of("file_names_sort", "desc"), queryCaptor.getValue().get("sort"));
    }

    @Test
    void shouldReturnMappedProtocolFields() throws Exception {
        Map<String, Object> protocol = createSampleProtocol("70385678", "Test Protocol");
        doReturn(List.of(protocol)).when(esService).collectPage(
                any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.protocolOverview(createBaseParams());

        assertEquals(1, results.size());
        assertEquals("70385678", results.get(0).get("protocol_pk_id"));
        assertEquals("Test Protocol", results.get(0).get("protocol_name"));
        assertEquals(List.of("dg.4DFC/12345678"), results.get(0).get("file_ids"));
        assertEquals(List.of("dg.4DFC/12345678"), results.get(0).get("files"));
        assertEquals(List.of("protocol.pdf"), results.get(0).get("file_names"));
    }

    @Test
    void shouldReturnEmptyListWhenNoProtocolsMatch() throws Exception {
        List<Map<String, Object>> results = fetcher.protocolOverview(createBaseParams());

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    void shouldReturnMultipleProtocols() throws Exception {
        doReturn(List.of(
                createSampleProtocol("70385678", "Protocol One"),
                createSampleProtocol("62226433", "Protocol Two")
        )).when(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.protocolOverview(createBaseParams());

        assertEquals(2, results.size());
        assertEquals("70385678", results.get(0).get("protocol_pk_id"));
        assertEquals("62226433", results.get(1).get("protocol_pk_id"));
    }

    @Test
    void shouldPassPaginationToSearch() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("first", 25);
        params.put("offset", 50);

        fetcher.protocolOverview(params);

        assertEquals(25, pageSizeCaptor.getValue());
        assertEquals(50, offsetCaptor.getValue());
        assertFalse(hasTermsField(queryCaptor.getValue(), "first"));
        assertFalse(hasTermsField(queryCaptor.getValue(), "offset"));
    }

    private Map<String, Object> createBaseParams() {
        Map<String, Object> params = new HashMap<>();
        params.put("order_by", "");
        params.put("sort_direction", "ASC");
        params.put("first", 10);
        params.put("offset", 0);
        return params;
    }

    private Map<String, Object> createSampleProtocol(String protocolId, String protocolName) {
        Map<String, Object> protocol = new HashMap<>();
        protocol.put("protocol_pk_id", protocolId);
        protocol.put("protocol_name", protocolName);
        protocol.put("protocol_type", "Characterization");
        protocol.put("doi", "10.1234/test.doi");
        protocol.put("doi_url", "https://doi.org/10.1234/test.doi");
        protocol.put("file_names", List.of("protocol.pdf"));
        protocol.put("file_ids", List.of("dg.4DFC/12345678"));
        protocol.put("files", List.of("dg.4DFC/12345678"));
        return protocol;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> filters(Map<String, Object> query) {
        Map<String, Object> outer = (Map<String, Object>) query.get("query");
        Map<String, Object> bool = (Map<String, Object>) outer.get("bool");
        return (List<Map<String, Object>>) bool.get("filter");
    }

    private boolean hasTermsFilter(Map<String, Object> query, String field, List<String> values) {
        return filters(query).stream().anyMatch(filter -> {
            Object terms = filter.get("terms");
            if (!(terms instanceof Map<?, ?> termsMap)) {
                return false;
            }
            return values.equals(termsMap.get(field));
        });
    }

    private boolean hasTermsField(Map<String, Object> query, String field) {
        return filters(query).stream().anyMatch(filter -> {
            Object terms = filter.get("terms");
            return terms instanceof Map<?, ?> termsMap && termsMap.containsKey(field);
        });
    }
}
