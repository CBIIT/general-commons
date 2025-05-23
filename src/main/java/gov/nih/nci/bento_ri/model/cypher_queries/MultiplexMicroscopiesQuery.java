package gov.nih.nci.bento_ri.model.cypher_queries;

public class MultiplexMicroscopiesQuery {
    public static final String MULTIPLEX_MICROSCOPIES_QUERY = """
        MATCH (x:multiplex_microscopy)-->(:image)-->(:file)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $multiplex_microscopy_ids = [] OR x.MultiplexMicroscopy_id IN $multiplex_microscopy_ids
        WITH x, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (x)-->(:image)-->(f:file)
        WITH x, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH x, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, x {.*}) AS output
        RETURN output
        ORDER BY output.multiplex_microscopy_id ASC
    """;
}
