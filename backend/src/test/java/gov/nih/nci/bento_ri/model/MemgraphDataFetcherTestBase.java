package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento.model.ConfigurationDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.neo4j.driver.*;
import org.neo4j.driver.Record;

import java.lang.reflect.Field;

import static org.mockito.Mockito.lenient;

/**
 * Base test class for MemgraphDataFetcher tests.
 * Provides common mock setup and utility methods for node-specific test classes.
 */
@ExtendWith(MockitoExtension.class)
public abstract class MemgraphDataFetcherTestBase {

    @Mock
    protected ConfigurationDAO config;

    @Mock
    protected Driver driver;

    @Mock
    protected Session session;

    @Mock
    protected Result result;

    @Mock
    protected Record record;

    @Mock
    protected Value value;

    protected MemgraphDataFetcher fetcher;

    @BeforeEach
    void setUp() throws Exception {
        // Configure mock for connection
        lenient().when(config.getMemgraphEndpoint()).thenReturn("localhost");
        lenient().when(config.getMemgraphPort()).thenReturn("7687");
        lenient().when(config.getMemgraphUsername()).thenReturn("testuser");
        lenient().when(config.getMemgraphPassword()).thenReturn("testpass");

        // Create fetcher and inject mocked driver
        fetcher = new MemgraphDataFetcher(config);
        injectMockDriver(fetcher, driver);

        // Configure session mock (lenient because not all tests use the session)
        lenient().when(driver.session()).thenReturn(session);
    }

    /**
     * Injects a mock driver into the MemgraphDataFetcher using reflection.
     */
    protected void injectMockDriver(MemgraphDataFetcher fetcher, Driver mockDriver) throws Exception {
        Field driverField = MemgraphDataFetcher.class.getDeclaredField("driver");
        driverField.setAccessible(true);
        driverField.set(fetcher, mockDriver);
    }
}
