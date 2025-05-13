package gov.nih.nci.bento_ri.model.cypher_queries;

public class ImagesQuery {
    public static final String IMAGES_QUERY = """
        MATCH (i:image)
        WHERE
            $study_link_ids = [] OR i.study_link_id IN $study_link_ids
        WITH i, i {.*} AS output
        OPTIONAL MATCH (i)-->(f:file)
        WITH i, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH i, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        OPTIONAL MATCH (i)-->(:file)-->(s:study)
        WITH i, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH i, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
