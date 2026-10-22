package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento.service.ESService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
 * Unit tests for the subjectOverview search.
 * The Elasticsearch query is built for real; the search response is stubbed.
 */
class PrivateESDataFetcherSubjectOverviewTest {

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

    // subjectOverview searches /dashboard_participant/_search and calls collectPage once.
    @Test
    void shouldSearchDashboardParticipantIndex() throws Exception {
        fetcher.subjectOverview(createBaseParams());

        assertEquals("/dashboard_participant/_search", requestCaptor.getValue().getEndpoint());
        verify(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());
    }

    // A non-empty subject_ids list is a terms filter, an empty list is left out,
    // and file_ids and sex are both passed through as terms filters.
    @Test
    @DisplayName("subjectOverview 1")
    void subjectOverview1() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("subject_ids", List.of("PART-001"));
        params.put("file_ids", List.of("dg.4DFC/12345678"));
        params.put("sex", List.of("Female"));

        fetcher.subjectOverview(params);

        Map<String, Object> query = queryCaptor.getValue();
        assertTrue(hasTermsFilter(query, "subject_ids", List.of("PART-001")));
        assertTrue(hasTermsFilter(query, "file_ids", List.of("dg.4DFC/12345678")));
        assertTrue(hasTermsFilter(query, "sex", List.of("Female")));

        Map<String, Object> emptySubjectIds = createBaseParams();
        emptySubjectIds.put("subject_ids", List.of());

        fetcher.subjectOverview(emptySubjectIds);

        assertFalse(hasTermsField(queryCaptor.getValue(), "subject_ids"));
    }

    // With no order_by, results are sorted by subject_ids ascending.
    @Test
    void shouldSortBySubjectIdsByDefault() throws Exception {
        fetcher.subjectOverview(createBaseParams());

        assertEquals(Map.of("subject_ids", "asc"), queryCaptor.getValue().get("sort"));
    }

    // order_by site uses the mapped sort field site_sort.
    @Test
    void shouldSortSiteBySortField() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("order_by", "site");
        params.put("sort_direction", "DESC");

        fetcher.subjectOverview(params);

        assertEquals(Map.of("site_sort", "desc"), queryCaptor.getValue().get("sort"));
    }

    // Fields from a stubbed hit, such as subject_id and study_acronym, are returned as-is.
    @Test
    void shouldReturnMappedSubjectFields() throws Exception {
        Map<String, Object> subject = createSampleSubject("PART-001", "STUDY");
        doReturn(List.of(subject)).when(esService).collectPage(
                any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.subjectOverview(createBaseParams());

        assertEquals(1, results.size());
        assertEquals("PART-001", results.get(0).get("subject_id"));
        assertEquals("STUDY", results.get(0).get("study_acronym"));
        assertEquals("Female", results.get(0).get("sex"));
        assertEquals("Lung", results.get(0).get("site"));
    }

    // No matching hits come back as an empty list, not null.
    @Test
    void shouldReturnEmptyListWhenNoSubjectsMatch() throws Exception {
        List<Map<String, Object>> results = fetcher.subjectOverview(createBaseParams());

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    // Every stubbed hit is returned, in the same order.
    @Test
    void shouldReturnMultipleSubjects() throws Exception {
        doReturn(List.of(
                createSampleSubject("PART-001", "STUDY-A"),
                createSampleSubject("PART-002", "STUDY-B")
        )).when(esService).collectPage(any(Request.class), any(), any(String[][].class), anyInt(), anyInt());

        List<Map<String, Object>> results = fetcher.subjectOverview(createBaseParams());

        assertEquals(2, results.size());
        assertEquals("PART-001", results.get(0).get("subject_id"));
        assertEquals("PART-002", results.get(1).get("subject_id"));
    }

    // first and offset are the page size and offset, and are not query filters.
    @Test
    void shouldPassPaginationToSearch() throws Exception {
        Map<String, Object> params = createBaseParams();
        params.put("first", 25);
        params.put("offset", 50);

        fetcher.subjectOverview(params);

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

    private Map<String, Object> createSampleSubject(String subjectId, String studyAcronym) {
        Map<String, Object> subject = new HashMap<>();
        subject.put("subject_id", subjectId);
        subject.put("study_acronym", studyAcronym);
        subject.put("sex", "Female");
        subject.put("site", "Lung");
        return subject;
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
