package gov.nih.nci.bento_ri.model.cypher_queries;

public class SamplesQuery {
    public static final String SAMPLES_QUERY = """
        MATCH (samp:sample)
        WHERE
            $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH samp, samp {.*} AS output
        OPTIONAL MATCH (samp)-->(:participant)-->(s:study)
        WITH samp, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH samp, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        OPTIONAL MATCH (samp)-->(p:participant)
        WITH samp, p, output
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH samp, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        RETURN output
    """;
}
