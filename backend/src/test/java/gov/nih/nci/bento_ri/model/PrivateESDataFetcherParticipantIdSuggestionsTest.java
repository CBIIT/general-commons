package gov.nih.nci.bento_ri.model;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento.service.ESService;
import org.apache.http.util.EntityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.opensearch.client.Request;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for participant id suggestions.
 * The OpenSearch query is built for real; the search response is stubbed.
 */
class PrivateESDataFetcherParticipantIdSuggestionsTest {

    private ESService esService;
    private PrivateESDataFetcher fetcher;
    private ArgumentCaptor<Request> requestCaptor;
    private final Gson gson = new Gson();

    // Spy ESService so the query is built for real, and stub send so no search is sent.
    @BeforeEach
    void setUp() throws Exception {
        ConfigurationDAO config = mock(ConfigurationDAO.class);
        esService = spy(new ESService(config));
        fetcher = new PrivateESDataFetcher(esService, mock(MemgraphDataFetcher.class));
        requestCaptor = ArgumentCaptor.forClass(Request.class);
        doReturn(aggregationWithBuckets()).when(esService).send(requestCaptor.capture());
    }

    // A typed prefix searches the participant-id index, returns no documents, and asks for only that page of unique ids.
    @Test
    void shouldSearchByParticipantPrefix() throws Exception {
        fetcher.participantIdSuggestions("PA", 20);

        assertEquals("/dashboard_participant_ids/_search", requestCaptor.getValue().getEndpoint());
        JsonObject body = queryBody();
        assertEquals(0, body.get("size").getAsInt());
        assertEquals("PA", body.getAsJsonObject("query")
                .getAsJsonObject("prefix")
                .get("participant_id")
                .getAsString());
        JsonObject terms = body.getAsJsonObject("aggregations")
                .getAsJsonObject("participant_id")
                .getAsJsonObject("terms");
        assertEquals("participant_id", terms.get("field").getAsString());
        assertEquals(20, terms.get("size").getAsInt());
    }

    // A requested page of 10000 is clamped to 50 so one request cannot allocate the old full id list.
    @Test
    void shouldCapSuggestionPageSize() throws Exception {
        fetcher.participantIdSuggestions("PART", 10000);

        int size = queryBody().getAsJsonObject("aggregations")
                .getAsJsonObject("participant_id")
                .getAsJsonObject("terms")
                .get("size")
                .getAsInt();
        assertEquals(50, size);
    }

    // A blank prefix matches every participant, so it returns immediately and does not call OpenSearch.
    @Test
    void shouldIgnoreBlankPrefix() throws Exception {
        assertEquals(List.of(), fetcher.participantIdSuggestions("", 20));
        assertEquals(List.of(), fetcher.participantIdSuggestions("   ", 20));

        verify(esService, never()).send(any());
    }

    // A one-character prefix is still too broad, so suggestions start at two characters.
    @Test
    void shouldIgnoreSingleCharacterPrefix() throws Exception {
        assertEquals(List.of(), fetcher.participantIdSuggestions("P", 20));

        verify(esService, never()).send(any());
    }

    // The result is only the id strings from the aggregation buckets, not document counts or hit metadata.
    @Test
    void shouldReturnBucketKeysOnly() throws Exception {
        List<String> ids = fetcher.participantIdSuggestions("PART", 20);

        assertEquals(List.of("PART-001", "PART-002"), ids);
    }

    private JsonObject queryBody() throws Exception {
        String json = EntityUtils.toString(requestCaptor.getValue().getEntity());
        return gson.fromJson(json, JsonObject.class);
    }

    private JsonObject aggregationWithBuckets() {
        JsonArray buckets = new JsonArray();
        buckets.add(bucket("PART-001"));
        buckets.add(bucket("PART-002"));
        JsonObject participantId = new JsonObject();
        participantId.add("buckets", buckets);
        JsonObject aggregations = new JsonObject();
        aggregations.add("participant_id", participantId);
        JsonObject root = new JsonObject();
        root.add("aggregations", aggregations);
        return root;
    }

    private JsonObject bucket(String key) {
        JsonObject bucket = new JsonObject();
        bucket.addProperty("key", key);
        bucket.addProperty("doc_count", 1);
        return bucket;
    }
}
