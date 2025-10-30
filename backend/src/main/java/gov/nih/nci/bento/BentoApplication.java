package gov.nih.nci.bento;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages = {"gov.nih.nci"}, exclude = {org.springframework.boot.autoconfigure.neo4j.Neo4jAutoConfiguration.class}
)
public class BentoApplication extends SpringBootServletInitializer {
	private static final Logger logger = LogManager.getLogger(BentoApplication.class);

	public static void main(String[] args) {
		logger.info("=== BentoApplication Starting ===");
		logger.info("Starting Spring Boot application...");
		try {
			SpringApplication.run(BentoApplication.class, args);
		} catch (Exception e) {
			logger.error("Fatal error during application startup", e);
			throw e;
		}
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		logger.info("=== BentoApplication.configure() called ===");
		logger.info("Configuring SpringApplicationBuilder for servlet deployment...");
		logger.info("Server started");

		return application.sources(BentoApplication.class);

	}
}
