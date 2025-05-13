package gov.nih.nci.bento_ri.model.cypher_queries;

public class VersionQuery {
    public static final String VERSION_QUERY = """
        MATCH (v:version)
        RETURN v AS output
    """;
}
