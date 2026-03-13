package gov.nih.nci.bento_ri.model.cypher_queries;

public class CharacterizationQuery {
    public static final String CHARACTERIZATIONS_QUERY = """
        MATCH (char:Characterization)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        WHERE
            ($characterization_ids = [] OR char.Characterization_ID IN $characterization_ids)
            AND ($sample_ids = [] OR samp.sample_id IN $sample_ids)
        WITH DISTINCT char, samp, s
        ORDER BY char.Characterization_ID ASC
        RETURN char {.*, phs_accession: s.phs_accession, sample_id: samp.sample_id} AS output
    """;

    public static final String CHARACTERIZATIONS_COUNT_QUERY = """
        MATCH (char:Characterization)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT char) AS count
    """;
}
