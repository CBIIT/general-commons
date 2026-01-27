package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProtocolQuery {
    public static final String PROTOCOLS_QUERY = """
        MATCH (prot:Protocol)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $protocol_ids = [] OR prot.protocol_pk_id IN $protocol_ids
        WITH DISTINCT prot, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (prot)-->(f:file)
        WHERE $file_ids = [] OR f.file_id IN $file_ids
        WITH prot, f, output
        OPTIONAL MATCH (prot)-->(samp:sample)
        WHERE $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH prot, apoc_replacement_poc.merge(output, {
            file_id: f.file_id,
            sample_id: samp.sample_id
        }) AS output
        RETURN apoc_replacement_poc.merge(output, prot{.*}) AS output
        ORDER BY output.protocol_pk_id ASC
    """;

    public static final String PROTOCOLS_COUNT_QUERY = """
        MATCH (prot:Protocol)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT prot) AS count
    """;
}
