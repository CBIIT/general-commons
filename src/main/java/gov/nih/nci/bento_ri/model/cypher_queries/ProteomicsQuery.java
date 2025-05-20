package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProteomicsQuery {
    public static final String PROTEOMICS_QUERY = """
        MATCH (p:proteomic)
        WHERE
            $proteomic_info_ids = [] OR p.proteomic_info_id IN $proteomic_info_ids
        WITH p, p {.*} AS output
        OPTIONAL MATCH (p)-->(f:file)
        WITH p, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH p, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        OPTIONAL MATCH (p)-->(:file)-->(s:study)
        WITH p, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH p, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
