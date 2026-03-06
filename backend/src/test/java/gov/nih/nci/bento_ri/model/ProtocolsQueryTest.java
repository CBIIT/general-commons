package gov.nih.nci.bento_ri.model;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the 'protocols' GraphQL query.
 * Tests the protocolDataFetcher method in MemgraphDataFetcher.
 */
class ProtocolsQueryTest extends MemgraphDataFetcherTestBase {

    @Test
    void shouldExecuteQuery() {
        // Arrange
        Map<String, Object> params = createBaseParams();
        Map<String, Object> protocolData = createSampleProtocolData();

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.list(any())).thenReturn(List.of(protocolData));

        // Act
        List<Map<String, Object>> results = fetcher.protocolDataFetcher(params);

        // Assert
        assertNotNull(results);
        verify(session).run(anyString(), any(Map.class));
    }

    @Test
    void shouldPassAllParametersToQuery() {
        // Arrange
        Map<String, Object> params = new HashMap<>();
        params.put("phs_accession", "phs001234");
        params.put("protocol_ids", List.of("PROT-001", "PROT-002"));
        params.put("file_ids", List.of("FILE-001"));
        params.put("sample_ids", List.of("SAMP-001", "SAMP-002"));
        params.put("first", 10);
        params.put("offset", 0);

        ArgumentCaptor<Map<String, Object>> paramsCaptor = ArgumentCaptor.forClass(Map.class);

        when(session.run(anyString(), paramsCaptor.capture())).thenReturn(result);
        when(result.list(any())).thenReturn(List.of());

        // Act
        fetcher.protocolDataFetcher(params);

        // Assert
        Map<String, Object> capturedParams = paramsCaptor.getValue();
        assertEquals("phs001234", capturedParams.get("phs_accession"));
        assertEquals(List.of("PROT-001", "PROT-002"), capturedParams.get("protocol_ids"));
        assertEquals(List.of("FILE-001"), capturedParams.get("file_ids"));
        assertEquals(List.of("SAMP-001", "SAMP-002"), capturedParams.get("sample_ids"));
    }

    @Test
    void shouldReturnEmptyListWhenNoResults() {
        // Arrange
        Map<String, Object> params = createBaseParams();

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.list(any())).thenReturn(List.of());

        // Act
        List<Map<String, Object>> results = fetcher.protocolDataFetcher(params);

        // Assert
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    void shouldReturnMultipleProtocols() {
        // Arrange
        Map<String, Object> params = createBaseParams();
        Map<String, Object> protocol1 = createSampleProtocolData("PROT-001", "Protocol One");
        Map<String, Object> protocol2 = createSampleProtocolData("PROT-002", "Protocol Two");

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.list(any())).thenReturn(List.of(protocol1, protocol2));

        // Act
        List<Map<String, Object>> results = fetcher.protocolDataFetcher(params);

        // Assert
        assertEquals(2, results.size());
    }

    @Test
    void shouldAcceptPaginationParameters() {
        // Arrange
        Map<String, Object> params = new HashMap<>();
        params.put("phs_accession", "phs001234");
        params.put("protocol_ids", List.of());
        params.put("file_ids", List.of());
        params.put("sample_ids", List.of());
        params.put("first", 5);
        params.put("offset", 10);

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.list(any())).thenReturn(List.of());

        // Act & Assert - should not throw
        List<Map<String, Object>> results = fetcher.protocolDataFetcher(params);
        
        assertNotNull(results);
        verify(session).run(anyString(), any(Map.class));
    }

    @Test
    void shouldRejectInvalidFirstParameter() {
        // Arrange
        Map<String, Object> params = new HashMap<>();
        params.put("phs_accession", "phs001234");
        params.put("protocol_ids", List.of());
        params.put("file_ids", List.of());
        params.put("sample_ids", List.of());
        params.put("first", -1);  // Invalid: negative value
        params.put("offset", 0);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            fetcher.protocolDataFetcher(params);
        });
    }

    @Test
    void shouldRejectInvalidOffsetParameter() {
        // Arrange
        Map<String, Object> params = new HashMap<>();
        params.put("phs_accession", "phs001234");
        params.put("protocol_ids", List.of());
        params.put("file_ids", List.of());
        params.put("sample_ids", List.of());
        params.put("first", 10);
        params.put("offset", -1);  // Invalid: negative value

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            fetcher.protocolDataFetcher(params);
        });
    }

    // --- Helper Methods ---

    private Map<String, Object> createBaseParams() {
        Map<String, Object> params = new HashMap<>();
        params.put("phs_accession", "phs001234");
        params.put("protocol_ids", List.of());
        params.put("file_ids", List.of());
        params.put("sample_ids", List.of());
        params.put("first", 10);
        params.put("offset", 0);
        return params;
    }

    private Map<String, Object> createSampleProtocolData() {
        return createSampleProtocolData("PROT-001", "Test Protocol");
    }

    private Map<String, Object> createSampleProtocolData(String protocolId, String protocolName) {
        Map<String, Object> data = new HashMap<>();
        data.put("protocol_pk_id", protocolId);
        data.put("protocol_name", protocolName);
        data.put("protocol_type", "Characterization");
        data.put("doi", "10.1234/test.doi");
        data.put("crdc_id", "crdc:PROT-001");
        data.put("phs_accession", "phs001234");
        data.put("file_id", "FILE-001");
        data.put("sample_id", "SAMP-001");
        return data;
    }
}
