package gov.nih.nci.bento.graphql;

import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento.service.ESService;
import gov.nih.nci.bento_ri.model.GeneralCommonsRuntimeWiring;
import gov.nih.nci.bento_ri.model.MemgraphDataFetcher;
import gov.nih.nci.bento_ri.model.PrivateESDataFetcher;
import graphql.ExecutionResult;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BentoGraphQLSchemaTest {

    @Test
    void schemaLoadsFromClasspathAndSchemaVersionQueryReturnsHardcodedValue() throws Exception {
        ConfigurationDAO config = mock(ConfigurationDAO.class);
        when(config.getSchemaFile()).thenReturn("graphql/general-commons-schema.graphql");
        when(config.getMaxPageSize()).thenReturn(10000);

        GeneralCommonsRuntimeWiring wiring = new GeneralCommonsRuntimeWiring(
                mock(MemgraphDataFetcher.class),
                mock(PrivateESDataFetcher.class),
                mock(ESService.class)
        );
        BentoGraphQL bentoGraphQL = new BentoGraphQL(config, wiring, new PageSizeLimitInstrumentation(config));

        ExecutionResult result = bentoGraphQL.getPrivateGraphQL().execute("{ schemaVersion }");

        assertTrue(result.getErrors().isEmpty(), () -> result.getErrors().toString());
        assertEquals("3.1.0", ((Map<?, ?>) result.getData()).get("schemaVersion"));
    }
}
