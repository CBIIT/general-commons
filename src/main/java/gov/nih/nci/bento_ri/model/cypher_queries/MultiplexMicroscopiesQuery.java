package gov.nih.nci.bento_ri.model.cypher_queries;

public class MultiplexMicroscopiesQuery {
    public static final String MULTIPLEX_MICROSCOPIES_QUERY = """
        MATCH (m:multiplex_microscopy)
        WHERE
            $multiplex_microscopy_ids = [] OR m.MultiplexMicroscopy_id IN $multiplex_microscopy_ids
        WITH m, m {.*} AS output
        OPTIONAL MATCH (m)-->(:image)
        WITH m, f, output
        WHERE
            $study_link_ids = [] OR i.study_link_id IN $study_link_ids
        WITH m, apoc_replacement_poc.merge(output, {
            study_link_id: i.study_link_id
        }) AS output
        OPTIONAL MATCH (m)-->(:image)-->(:file)-->(s:study)
        WITH m, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH m, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
