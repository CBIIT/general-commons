package gov.nih.nci.bento_ri.model.cypher_queries;

public class StudiesQuery {
    public static final String STUDIES_QUERY = """
        MATCH (s:study)
        WHERE
            ($study_names = [] OR s.study_name IN $study_names) AND
            ($study_acronyms = [] OR s.study_acronym IN $study_acronyms) AND
            ($phs_accessions = [] OR s.phs_accession IN $phs_accessions)
        RETURN s{.*} AS output
        ORDER BY output.phs_accession ASC
    """;
}
