package gov.nih.nci.bento.controller;

import gov.nih.nci.bento.graphql.BentoGraphQL;
import gov.nih.nci.bento.model.ConfigurationDAO;
import gov.nih.nci.bento_ri.model.GeneralCommonsController;
import graphql.ExecutionInput;
import graphql.ExecutionResult;
import graphql.GraphQL;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {GraphQLController.class, IndexController.class, GeneralCommonsController.class})
@ActiveProfiles("test")
@Import(WebMvcContractTest.ControllerStubs.class)
class WebMvcContractTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BentoGraphQL bentoGraphQL;

    @TestConfiguration
    static class ControllerStubs {
        @Bean
        ConfigurationDAO configurationDAO() {
            ConfigurationDAO configurationDAO = mock(ConfigurationDAO.class);
            when(configurationDAO.getSchemaDoc()).thenReturn("documentation/General Commons API.txt");
            when(configurationDAO.getBentoApiVersion()).thenReturn("2.2.0");
            when(configurationDAO.isAllowGraphQLQuery()).thenReturn(true);
            return configurationDAO;
        }
    }

    @BeforeEach
    void setUp() {
        GraphQL graphQL = mock(GraphQL.class);
        ExecutionResult executionResult = mock(ExecutionResult.class);

        lenient().when(bentoGraphQL.getPrivateGraphQL()).thenReturn(graphQL);
        lenient().when(graphQL.execute(any(ExecutionInput.class))).thenReturn(executionResult);
        lenient().when(executionResult.toSpecification()).thenReturn(Map.of("data", Map.of("schemaVersion", "3.1.0")));
    }

    @Test
    void pingReturnsPong() throws Exception {
        mockMvc.perform(get("/ping"))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));
    }

    @Test
    void versionReturnsJsonFromConfig() throws Exception {
        mockMvc.perform(get("/version"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().json("{\"version\":\"2.2.0\"}"));
    }

    @Test
    void getGraphQLReturnsSchemaDocumentation() throws Exception {
        mockMvc.perform(get("/v1/graphql/"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN));
    }

    @Test
    void postGraphQLReturnsOkForQuery() throws Exception {
        mockMvc.perform(post("/v1/graphql/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\":\"{ schemaVersion }\",\"variables\":{}}"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void putGraphQLReturnsMethodNotAllowed() throws Exception {
        mockMvc.perform(put("/v1/graphql/"))
                .andExpect(status().isMethodNotAllowed());
    }
}
