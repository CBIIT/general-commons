package gov.nih.nci.bento_ri.model.cypher_queries;

public class NonDICOMCTimagesQuery {
    public static final String NON_DICOMCT_IMAGES_QUERY = """
        MATCH (x:NonDICOMCTimages)-->(:image)-->(:file)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $non_dicomct_images_ids = [] OR x.non_dicomct_images_id IN $non_dicomct_images_ids
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
