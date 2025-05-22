package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProgramsQuery {
    public static final String PROGRAMS_QUERY = """
        MATCH (p:program)
        RETURN p{.*} AS output
        ORDER BY output.program_name ASC
    """;
}
