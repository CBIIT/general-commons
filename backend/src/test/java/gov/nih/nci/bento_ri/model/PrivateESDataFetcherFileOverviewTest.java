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
 * Unit tests for the fileOverview search.
 * The Elasticsearch query is built for real; the search response is stubbed.
 */
class PrivateESDataFetcherFileOverviewTest {

    private ESService esService;
    private PrivateESDataFetcher fetcher;
    private ArgumentCaptor<Request> requestCaptor;
    private ArgumentCaptor<Map<String, Object>> queryCaptor;
    private ArgumentCaptor<Integer> pageSizeCaptor;
    private ArgumentCaptor<Integer> offsetCaptor;

    // Spy ESService so the query is built for real, and stub collectPage so no search is sent.
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

    // fileOverview searches /dashboard_file/_search and calls collectPage once.
    @Test
    void shouldSearchDashboardFileIndex() throws Exception {
        fetcher.fileOverview(createBaseParams());

        assertEquals("/dashboard_file/_search", requestCaptor.getValue().getEndpoint());
        verify(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());
    }

    // A non-empty file_ids list is added as a terms filter.
    @Test
    void shouldFilterByFileIds() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("file_ids", List.of("dg.4DFC/12345678"));

        fetcher.fileOverview(params);

        assertTrue(hasTermsFilter(queryCaptor.getValue(), "file_ids",
                List.of("dg.4DFC/12345678")));
    }

    // An empty file_ids list is left out of the query.
    @Test
    void shouldIgnoreEmptyFileIds() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("file_ids", List.of());

        fetcher.fileOverview(params);

        assertFalse(hasTermsField(queryCaptor.getValue(), "file_ids"));
    }

    // subject_ids and sample_ids are both passed through as terms filters.
    @Test
    void shouldPassSubjectAndSampleFilters() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("subject_ids", List.of("PART-001"));
        params.put("sample_ids", List.of("SAMP-001", "SAMP-002"));

        fetcher.fileOverview(params);

        Map<String, Object> query = queryCaptor.getValue();
        assertTrue(hasTermsFilter(query, "subject_ids", List.of("PART-001")));
        assertTrue(hasTermsFilter(query, "sample_ids", List.of("SAMP-001", "SAMP-002")));
    }

    // With no order_by, results are sorted by file_name ascending.
    @Test
    void shouldSortByFileNameByDefault() throws Exception {
        fetcher.fileOverview(createBaseParams());

        assertEquals(Map.of("file_name", "asc"), queryCaptor.getValue().get("sort"));
    }

    // order_by and sort_direction set the query sort field and direction.
    @Test
    void shouldSortByRequestedFileField() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("order_by", "file_id");
        params.put("sort_direction", "DESC");

        fetcher.fileOverview(params);

        assertEquals(Map.of("file_id", "desc"), queryCaptor.getValue().get("sort"));
    }

    // Fields from a stubbed hit, such as file_id and file_name, are returned as-is.
    @Test
    void shouldReturnMappedFileFields() throws Exception {
        Map<String, Object> file = createSampleFile("dg.4DFC/example", "example.bam");
        doReturn(List.of(file)).when(esService).collectPage(
                any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.fileOverview(createBaseParams());

        assertEquals(1, results.size());
        assertEquals("dg.4DFC/example", results.get(0).get("file_id"));
        assertEquals("example.bam", results.get(0).get("file_name"));
        assertEquals("BAM", results.get(0).get("file_type"));
    }

    // No matching hits come back as an empty list, not null.
    @Test
    void shouldReturnEmptyListWhenNoFilesMatch() throws Exception {
        List<Map<String, Object>> results = fetcher.fileOverview(createBaseParams());

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    // Every stubbed hit is returned, in the same order.
    @Test
    void shouldReturnMultipleFiles() throws Exception {
        doReturn(List.of(
                createSampleFile("dg.4DFC/one", "one.bam"),
                createSampleFile("dg.4DFC/two", "two.bam")
        )).when(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.fileOverview(createBaseParams());

        assertEquals(2, results.size());
        assertEquals("dg.4DFC/one", results.get(0).get("file_id"));
        assertEquals("dg.4DFC/two", results.get(1).get("file_id"));
    }

    // first and offset are the page size and offset, and are not query filters.
    @Test
    void shouldPassPaginationToSearch() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("first", 25);
        params.put("offset", 50);

        fetcher.fileOverview(params);

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

    private Map<String, Object> createSampleFile(String fileId, String fileName) {
        Map<String, Object> file = new HashMap<>();
        file.put("file_id", fileId);
        file.put("file_name", fileName);
        file.put("file_type", "BAM");
        return file;
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
