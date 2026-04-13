package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProtocolQuery {
    public static final String PROTOCOLS_QUERY = """
        MATCH (prot:Protocol)-[*]->(:sample)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $protocol_ids = [] OR prot.protocol_pk_id IN $protocol_ids
        WITH DISTINCT prot, s
        OPTIONAL MATCH (prot)-->(f:file)
        WHERE $file_ids = [] OR f.file_id IN $file_ids
        WITH prot, s, f
        OPTIONAL MATCH (prot)-->(samp:sample)
        WHERE $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH DISTINCT prot, s, f, samp
        ORDER BY prot.protocol_pk_id ASC
        RETURN prot {.*, phs_accession: s.phs_accession, file_id: f.file_id, sample_id: samp.sample_id} AS output
    """;

    public static final String PROTOCOLS_COUNT_QUERY = """
        MATCH (prot:Protocol)-[*]->(:sample)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT prot) AS count
    """;
}
