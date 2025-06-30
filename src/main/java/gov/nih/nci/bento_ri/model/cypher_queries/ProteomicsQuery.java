package gov.nih.nci.bento_ri.model.cypher_queries;

public class ProteomicsQuery {
    public static final String PROTEOMICS_QUERY = """
        MATCH (p:proteomic)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $proteomic_info_ids = [] OR p.proteomic_info_id IN $proteomic_info_ids
        WITH p, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (p)-->(f:file)
        WITH p, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH p, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, p {.*}) AS output
        RETURN output
        ORDER BY output.proteomic_info_id ASC
    """;

    public static final String PROTEOMICS_COUNT_QUERY = """
        MATCH (p:proteomic)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT p) AS count
    """;
}
