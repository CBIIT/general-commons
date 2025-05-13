package gov.nih.nci.bento_ri.model.cypher_queries;

public class NonDICOMCTimagesQuery {
    public static final String NON_DICOMCT_IMAGES_QUERY = """
        MATCH (n:NonDICOMCTimages)
        WHERE
            $non_dicomct_images_ids = [] OR n.NonDICOMCTimages_id IN $non_dicomct_images_ids
        WITH n, n {.*} AS output
        OPTIONAL MATCH (n)-->(i:image)
        WITH n, i, output
        WHERE
            $study_link_ids = [] OR i.study_link_id IN $study_link_ids
        WITH n, apoc_replacement_poc.merge(output, {
            study_link_id: i.study_link_id
            }) AS output
        OPTIONAL MATCH (n)-->(:image)-->(:file)-->(s:study)
        WITH n, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH n, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
