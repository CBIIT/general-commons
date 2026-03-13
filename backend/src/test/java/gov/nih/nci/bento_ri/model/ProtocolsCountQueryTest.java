package gov.nih.nci.bento_ri.model;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the 'protocolsCount' GraphQL query.
 * Tests the getNumberOfProtocols method in MemgraphDataFetcher.
 */
class ProtocolsCountQueryTest extends MemgraphDataFetcherTestBase {

    @Test
    void shouldExecuteCountQuery() {
        // Arrange
        Map<String, Object> params = Map.of("phs_accession", "phs001234");

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.single()).thenReturn(record);
        when(record.get("count")).thenReturn(value);
        when(value.asLong()).thenReturn(42L);

        // Act
        Long count = fetcher.getNumberOfProtocols(params);

        // Assert
        assertEquals(42L, count);
    }

    @Test
    void shouldReturnZeroWhenNoProtocols() {
        // Arrange
        Map<String, Object> params = Map.of("phs_accession", "phs001234");

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.single()).thenReturn(record);
        when(record.get("count")).thenReturn(value);
        when(value.asLong()).thenReturn(0L);

        // Act
        Long count = fetcher.getNumberOfProtocols(params);

        // Assert
        assertEquals(0L, count);
    }

    @Test
    void shouldPassPhsAccessionParameter() {
        // Arrange
        Map<String, Object> params = Map.of("phs_accession", "phs999999");

        ArgumentCaptor<Map<String, Object>> paramsCaptor = ArgumentCaptor.forClass(Map.class);

        when(session.run(anyString(), paramsCaptor.capture())).thenReturn(result);
        when(result.single()).thenReturn(record);
        when(record.get("count")).thenReturn(value);
        when(value.asLong()).thenReturn(10L);

        // Act
        fetcher.getNumberOfProtocols(params);

        // Assert
        Map<String, Object> capturedParams = paramsCaptor.getValue();
        assertEquals("phs999999", capturedParams.get("phs_accession"));
    }

    @Test
    void shouldHandleLargeCount() {
        // Arrange
        Map<String, Object> params = Map.of("phs_accession", "phs001234");
        long largeCount = 1_000_000L;

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.single()).thenReturn(record);
        when(record.get("count")).thenReturn(value);
        when(value.asLong()).thenReturn(largeCount);

        // Act
        Long count = fetcher.getNumberOfProtocols(params);

        // Assert
        assertEquals(largeCount, count);
    }

    @Test
    void shouldCallSessionRun() {
        // Arrange
        Map<String, Object> params = Map.of("phs_accession", "phs001234");

        when(session.run(anyString(), any(Map.class))).thenReturn(result);
        when(result.single()).thenReturn(record);
        when(record.get("count")).thenReturn(value);
        when(value.asLong()).thenReturn(5L);

        // Act
        fetcher.getNumberOfProtocols(params);

        // Assert
        verify(session).run(anyString(), any(Map.class));
        verify(result).single();
        verify(record).get("count");
    }
}
