package gov.nih.nci.bento_ri.model.cypher_queries;

public class GenomicInfoQuery {
    public static final String GENOMIC_INFO_QUERY = """
        MATCH (g:genomic_info)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $genomic_info_ids = [] OR g.genomic_info_id IN $genomic_info_ids
        WITH g, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (g)-->(f:file)
        WITH g, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH g, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, g {.*}) AS output
        RETURN output
        ORDER BY output.genomic_info_id ASC
    """;

    public static final String GENOMIC_INFO_COUNT_QUERY = """
        MATCH (g:genomic_info)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT g) AS count
    """;
}
