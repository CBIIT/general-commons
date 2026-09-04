package gov.nih.nci.bento;

import gov.nih.nci.bento.graphql.BentoGraphQL;
import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento.service.ESService;
import gov.nih.nci.bento_ri.model.GeneralCommonsRuntimeWiring;
import gov.nih.nci.bento_ri.model.MemgraphDataFetcher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = BentoApplication.class)
@ActiveProfiles("test")
class BentoApplicationContextTest {

    @MockitoBean
    private MemgraphDataFetcher memgraphDataFetcher;

    @MockitoBean
    private ESService esService;

    @MockitoBean
    private BentoGraphQL bentoGraphQL;

    @Autowired
    private Environment environment;

    @Autowired
    private GeneralCommonsRuntimeWiring generalCommonsRuntimeWiring;

    @Autowired
    private ConfigurationDAO configurationDAO;

    @Test
    void contextLoadsWithBoundEnvironmentAndYamlWiring() {
        assertNotNull(configurationDAO);
        assertNotNull(generalCommonsRuntimeWiring.getRuntimeWiring());
        assertEquals("graphql/general-commons-schema.graphql", environment.getProperty("graphql.schema"));
        assertEquals("localhost", environment.getProperty("memgraph.endpoint"));
        assertEquals("false", environment.getProperty("es.filter.enabled"));
    }
}
