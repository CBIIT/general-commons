package gov.nih.nci.bento_ri.model.cypher_queries;

public class ParticipantsQuery {
    public static final String PARTICIPANTS_QUERY = """
        MATCH (p:participant)-->(s:study {phs_accession: $phs_accession})
        WITH DISTINCT p, s
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH p, {phs_accession: s.phs_accession} AS output
        RETURN apoc_replacement_poc.merge(output, p{.*}) AS output
        ORDER BY output.participant_id ASC
    """;
}
