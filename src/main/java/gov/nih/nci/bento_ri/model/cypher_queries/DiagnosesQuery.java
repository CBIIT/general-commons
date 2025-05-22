package gov.nih.nci.bento_ri.model.cypher_queries;

public class DiagnosesQuery {
    public static final String DIAGNOSES_QUERY = """
        MATCH (diag:diagnosis)-->(:participant)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $diagnosis_ids = [] OR diag.diagnosis_id IN $diagnosis_ids
        WITH DISTINCT diag, {
            phs_accession: s.phs_accession
        } AS output
        MATCH (diag)-->(p:participant)
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH diag, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        RETURN apoc_replacement_poc.merge(output, diag {.*}) AS output
        ORDER BY output.diagnosis_id ASC
    """;
}
