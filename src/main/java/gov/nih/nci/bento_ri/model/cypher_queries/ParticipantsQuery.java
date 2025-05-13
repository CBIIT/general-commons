package gov.nih.nci.bento_ri.model.cypher_queries;

public class ParticipantsQuery {
    public static final String PARTICIPANTS_QUERY = """
        MATCH (p:participant)
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH p, p {.*} AS output
        OPTIONAL MATCH (p)-->(s:study)
        WITH p, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession IN $phs_accessions
        RETURN apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
    """;
}
