package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProtocolQuery {
    public static final String PROTOCOLS_QUERY = """
        MATCH (prot:Protocol)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $protocol_ids = [] OR prot.protocol_pk_id IN $protocol_ids
        WITH DISTINCT prot, s
        ORDER BY prot.protocol_pk_id ASC
        RETURN prot {.*, phs_accession: s.phs_accession} AS output
    """;

    public static final String PROTOCOLS_COUNT_QUERY = """
        MATCH (prot:Protocol)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT prot) AS count
    """;
}
