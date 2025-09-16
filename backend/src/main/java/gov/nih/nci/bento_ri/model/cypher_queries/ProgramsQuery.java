package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProgramsQuery {
    public static final String PROGRAMS_QUERY = """
        MATCH (p:program)
        WHERE
            $program_names = [] OR p.program_name IN $program_names
        RETURN p{.*} AS output
        ORDER BY output.program_name ASC
    """;
    
    public static final String PROGRAMS_COUNT_QUERY = """
        MATCH (p:program)
        RETURN COUNT(DISTINCT p) AS count
    """;
}
