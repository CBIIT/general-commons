package gov.nih.nci.bento_ri.model.cypher_queries;

public class ImagesQuery {
    public static final String IMAGES_QUERY = """
        MATCH (i:image)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $study_link_ids = [] OR i.study_link_id IN $study_link_ids
        WITH i, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (i)-->(f:file)
        WITH i, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH i, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, i {.*}) AS output
        RETURN output
        ORDER BY output.study_link_id ASC
    """;

    public static final String IMAGES_COUNT_QUERY = """
        MATCH (i:image)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT i) AS count
    """;
}
