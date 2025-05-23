package gov.nih.nci.bento_ri.model.cypher_queries;

public class NonDICOMPETimagesQuery {
    public static final String NON_DICOMPET_IMAGES_QUERY = """
        MATCH (x:NonDICOMPETimages)-->(:image)-->(:file)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $non_dicompet_images_ids = [] OR x.NonDICOMPETimages_id IN $non_dicompet_images_ids
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
        ORDER BY output.non_dicompet_images_id ASC
    """;
}
