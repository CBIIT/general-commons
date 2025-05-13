package gov.nih.nci.bento_ri.model.cypher_queries;

public class TreatmentsQuery {
    public static final String TREATMENTS_QUERY = """
        MATCH (t:treatment)
        WHERE
            $treatment_ids = [] OR t.treatment_id IN $treatment_ids
        WITH t, t {.*} AS output
        OPTIONAL MATCH (t)-->(:participant)-->(s:study)
        WITH t, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH t, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        OPTIONAL MATCH (t)-->(p:participant)
        WITH t, p, output
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH t, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        RETURN output
    """;
}