package gov.nih.nci.bento.model;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * The Configuration Bean, reads configuration setting from classpath:application.properties.
 */
@Configuration
@PropertySource("classpath:application.properties")
@RequiredArgsConstructor
@Getter
public class ConfigurationDAO implements ApplicationContextAware {
	private static final Logger logger = LogManager.getLogger(ConfigurationDAO.class);

	//Bento API Version
	@Value("${bento.api.version:version not set}")
	private String bentoApiVersion;

	@Value("${graphql.schema:}")
	private String schemaFile;
	@Value("${docs.schema:}")
	private String schemaDoc;

	//Operation Type Enable
	@Value("${allow.graphql.query:true}")
	private boolean allowGraphQLQuery;
	@Value("${allow.graphql.mutation:false}")
	private boolean allowGraphQLMutation;

	//Elasticsearch Configuration
	@Value("${es.host:}")
	private String esHost;
	@Value("${es.port:-1}")
	private int esPort;
	@Value("${es.scheme:http}")
	private String esScheme;
	@Value("${es.filter.enabled:true}")
	private boolean esFilterEnabled;
	@Value("${es.sign.requests:true}")
	private boolean esSignRequests;

	@Value("${es.service.name:}")
	private String serviceName;
	@Value("${es.region:}")
	private String region;

	@Value("${memgraph.endpoint}")
	private String memgraphEndpoint;

	@Value("${memgraph.port}")
	private String memgraphPort;

	@Value("${memgraph.user:}")
	private String memgraphUsername;

	@Value("${memgraph.password:}")
	private String memgraphPassword;

	//Query Limits
	@Value("${validations.max_page_size:10000}")
	private int maxPageSize;

	@PostConstruct
	private void configValidation(){
		logger.info("=== Starting Configuration Validation ===");
		
		// Log environment and profile information
		try {
			String activeProfiles = String.join(", ", ((ConfigurableApplicationContext) this.context).getEnvironment().getActiveProfiles());
			if (activeProfiles.isEmpty()) {
				activeProfiles = "(no active profile - using default)";
			}
			logger.info("Active Spring profiles: {}", activeProfiles);
		} catch (Exception e) {
			logger.warn("Could not determine active profiles: {}", e.getMessage());
		}
		
		// Log all configuration values (masking sensitive values)
		logger.info("Configuration values loaded:");
		logger.info("  OpenSearch Configuration:");
		logger.info("    es.filter.enabled = {}", this.esFilterEnabled);
		logger.info("    es.host = {} (blank: {})", this.esHost.isEmpty() ? "(empty/not set)" : this.esHost, this.esHost.isBlank());
		logger.info("    es.port = {}", this.esPort == -1 ? "(not set/-1)" : this.esPort);
		logger.info("    es.scheme = {}", this.esScheme);
		logger.info("    es.sign.requests = {}", this.esSignRequests);
		logger.info("    es.service.name = {} (blank: {})", this.serviceName.isEmpty() ? "(empty/not set)" : this.serviceName, this.serviceName.isBlank());
		logger.info("    es.region = {} (blank: {})", this.region.isEmpty() ? "(empty/not set)" : this.region, this.region.isBlank());
		
		logger.info("  Memgraph Configuration:");
		logger.info("    memgraph.endpoint = {} (blank: {})", this.memgraphEndpoint == null ? "(null)" : (this.memgraphEndpoint.isEmpty() ? "(empty/not set)" : this.memgraphEndpoint), 
			this.memgraphEndpoint == null || this.memgraphEndpoint.isBlank());
		logger.info("    memgraph.port = {} (blank: {})", this.memgraphPort == null ? "(null)" : (this.memgraphPort.isEmpty() ? "(empty/not set)" : this.memgraphPort), 
			this.memgraphPort == null || this.memgraphPort.isBlank());
		logger.info("    memgraph.user = {} (blank: {})", this.memgraphUsername.isEmpty() ? "(empty/not set)" : this.memgraphUsername, this.memgraphUsername.isBlank());
		logger.info("    memgraph.password = {} (blank: {})", this.memgraphPassword.isEmpty() ? "(empty/not set)" : "(***MASKED***)", this.memgraphPassword.isBlank());
		
		logger.info("  Other Configuration:");
		logger.info("    bento.api.version = {}", this.bentoApiVersion);
		logger.info("    graphql.schema = {}", this.schemaFile.isEmpty() ? "(empty/not set)" : this.schemaFile);
		logger.info("    allow.graphql.query = {}", this.allowGraphQLQuery);
		logger.info("    allow.graphql.mutation = {}", this.allowGraphQLMutation);
		logger.info("    validations.max_page_size = {}", this.maxPageSize);
		
		boolean abortInitialization = false;
		
		// Validate OpenSearch configuration
		if(this.esFilterEnabled && (this.esHost.isBlank() || this.esPort == -1)){
			logger.error("=== OpenSearch Configuration Validation FAILED ===");
			logger.error("es.filter.enabled is set to 'true', but required OpenSearch configuration is missing:");
			if(this.esHost.isBlank()) {
				logger.error("  - es.host is blank or not set (current value: '{}')", this.esHost);
			}
			if(this.esPort == -1) {
				logger.error("  - es.port is not set (current value: {})", this.esPort);
			}
			logger.error("Either set es.filter.enabled=false to disable OpenSearch, or provide valid es.host and es.port values.");
			abortInitialization = true;
		} else if(this.esFilterEnabled) {
			logger.info("OpenSearch configuration validation PASSED");
		} else {
			logger.info("OpenSearch filtering is disabled (es.filter.enabled=false), skipping OpenSearch validation");
		}
		
		// Validate Memgraph configuration
		boolean memgraphEndpointBlank = this.memgraphEndpoint == null || this.memgraphEndpoint.isBlank();
		boolean memgraphPortBlank = this.memgraphPort == null || this.memgraphPort.isBlank();
		boolean memgraphUserBlank = this.memgraphUsername == null || this.memgraphUsername.isBlank();
		boolean memgraphPasswordBlank = this.memgraphPassword == null || this.memgraphPassword.isBlank();
		
		if(memgraphEndpointBlank || memgraphPortBlank || memgraphUserBlank || memgraphPasswordBlank){
			logger.error("=== Memgraph Configuration Validation FAILED ===");
			logger.error("One or more required Memgraph connection variables are missing:");
			if(memgraphEndpointBlank) {
				logger.error("  - memgraph.endpoint is null, blank, or not set (current value: {})", 
					this.memgraphEndpoint == null ? "null" : "'" + this.memgraphEndpoint + "'");
			}
			if(memgraphPortBlank) {
				logger.error("  - memgraph.port is null, blank, or not set (current value: {})", 
					this.memgraphPort == null ? "null" : "'" + this.memgraphPort + "'");
			}
			if(memgraphUserBlank) {
				logger.error("  - memgraph.user is blank or not set (current value: '{}')", this.memgraphUsername);
			}
			if(memgraphPasswordBlank) {
				logger.error("  - memgraph.password is blank or not set (current value: '{}')", 
					this.memgraphPassword.isEmpty() ? "(empty)" : "(set but blank)");
			}
			logger.error("All Memgraph configuration variables are required and must have non-blank values.");
			abortInitialization = true;
		} else {
			logger.info("Memgraph configuration validation PASSED");
		}
		
		if (abortInitialization) {
			logger.error("=== INITIALIZATION ABORTED DUE TO CONFIGURATION ERRORS ===");
			logger.error("Application will now terminate. Please fix the configuration issues listed above.");
			logger.error("Check your application.properties, application-{profile}.properties, and environment variables.");
			try {
				logger.error("Closing application context...");
				((ConfigurableApplicationContext) this.context).close();
				logger.error("Application context closed. Calling System.exit(0)...");
				System.exit(0);
			} catch (Exception e) {
				logger.error("Error during shutdown: {}", e.getMessage(), e);
				System.exit(1);
			}
		} else {
			logger.info("=== Configuration Validation PASSED - Application continuing startup ===");
		}
	}

	private ApplicationContext context;
	@Override
	public void setApplicationContext(@NotNull ApplicationContext applicationContext) throws BeansException {
		this.context = applicationContext;
	}
}
