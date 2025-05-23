package gov.nih.nci.bento_ri.model.cypher_queries;

public class NonDICOMMRimagesQuery {
    public static final String NON_DICOMMR_IMAGES_QUERY = """
        MATCH (x:NonDICOMMRimages)-->(:image)-->(:file)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $non_dicommr_images_ids = [] OR x.NonDICOMMRimages_id IN $non_dicommr_images_ids
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
        ORDER BY output.non_dicommr_images_id ASC
    """;
}
