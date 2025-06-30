package gov.nih.nci.bento_ri.model.cypher_queries;

public class SamplesQuery {
    public static final String SAMPLES_QUERY = """
        MATCH (samp:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH DISTINCT samp, {
            phs_accession: s.phs_accession
        } AS output
        MATCH (samp)-->(p:participant)
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH samp, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        RETURN apoc_replacement_poc.merge(output, samp {.*}) AS output
        ORDER BY output.sample_id ASC
    """;

    public static final String SAMPLES_COUNT_QUERY = """
        MATCH (samp:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT samp) AS count
    """;    
}
