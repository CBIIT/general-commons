package gov.nih.nci.bento_ri.model.cypher_queries;

public class SamplesQuery {
    public static final String SAMPLES_QUERY = """
        MATCH (samp:sample)-[*]->(s:study {phs_accession: $phs_accession})
        WHERE
            $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH samp, s
        OPTIONAL MATCH (samp)-->(p:participant)
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH DISTINCT samp, s, p
        ORDER BY samp.sample_id ASC
        RETURN samp {.*, phs_accession: s.phs_accession, participant_id: p.participant_id} as output
    """;

    public static final String SAMPLES_COUNT_QUERY = """
        MATCH (samp:sample)-[*]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT samp) AS count
    """;

    public static final String SAMPLES_TOTAL_COUNT_QUERY = """
        MATCH (samp:sample)
        RETURN COUNT(DISTINCT samp) AS count
    """;   
}
