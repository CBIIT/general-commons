package gov.nih.nci.bento_ri.model.cypher_queries;

public class TreatmentsQuery {
    public static final String TREATMENTS_QUERY = """
        MATCH (t:treatment)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $treatment_ids = [] OR t.treatment_id IN $treatment_ids
        WITH DISTINCT t, {
            phs_accession: s.phs_accession
        } AS output
        MATCH (t)-->(p:participant)
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH t, apoc_replacement_poc.merge(output, {
            participant_id: p.participant_id
        }) AS output
        RETURN apoc_replacement_poc.merge(output, t {.*}) AS output
        ORDER BY output.treatment_id ASC
    """;

    public static final String TREATMENTS_COUNT_QUERY = """
        MATCH (t:treatment)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT t) AS count
    """;
}