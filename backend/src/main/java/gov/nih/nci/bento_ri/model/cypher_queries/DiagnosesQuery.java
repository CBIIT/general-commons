package gov.nih.nci.bento_ri.model.cypher_queries;

public class DiagnosesQuery {
    public static final String DIAGNOSES_QUERY = """
        MATCH (diag:diagnosis)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
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

    public static final String DIAGNOSES_COUNT_QUERY = """
        MATCH (diag:diagnosis)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT diag) AS count
    """;

    public static final String DIAGNOSES_DISEASE_SITES_COUNT_QUERY = """
        MATCH (diag:diagnosis)
        WHERE diag.primary_site IS NOT NULL
        RETURN COUNT(DISTINCT diag.primary_site) AS count
    """;
}
