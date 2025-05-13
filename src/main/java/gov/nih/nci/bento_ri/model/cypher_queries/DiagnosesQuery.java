package gov.nih.nci.bento_ri.model.cypher_queries;

public class DiagnosesQuery {
    public static final String DIAGNOSES_QUERY = """
        MATCH (d:diagnosis)
        WHERE
            $diagnosis_ids = [] OR d.diagnosis_id IN $diagnosis_ids
        WITH d, d {.*} AS output
        OPTIONAL MATCH (d)-->(p:participant)
        WITH d, p, output
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH d, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        OPTIONAL MATCH (d)-->(:participant)-->(s:study)
        WITH d, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH d, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
