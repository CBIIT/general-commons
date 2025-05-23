package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento.model.ConfigurationDAO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class GeneralCommonsController {
    private static final Logger logger = LogManager.getLogger(GeneralCommonsController.class);

    private final String schemaFilePath;
    public GeneralCommonsController(
            ConfigurationDAO config
    ) {
        this.schemaFilePath = config.getSchemaDoc();
    }

    @CrossOrigin
    @RequestMapping(value = "/v1/graphql/", method = {RequestMethod.GET},
            produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getSchema() throws IOException {
        logger.info("GET request sent to /v1/graphql/");
        Resource schemaFile = new DefaultResourceLoader().getResource("classpath:"+this.schemaFilePath);
        if (!schemaFile.isReadable()){
            logger.error("Schema documentation file not found: "+this.schemaFilePath);
            return ResponseEntity.status(500).body("Internal Error: schema file not found");
        }
        return ResponseEntity.ok().body(new String(schemaFile.getInputStream().readAllBytes()));
    }
}
