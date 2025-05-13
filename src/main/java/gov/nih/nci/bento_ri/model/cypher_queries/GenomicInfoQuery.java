package gov.nih.nci.bento_ri.model.cypher_queries;

public class GenomicInfoQuery {
    public static final String GENOMIC_INFO_QUERY = """
        MATCH (g:genomic_info)
        WHERE
            $genomic_info_ids = [] OR g.genomic_info_id IN $genomic_info_ids
        WITH g, g {.*} AS output
        OPTIONAL MATCH (g)-->(f:file)
        WITH g, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH g, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        OPTIONAL MATCH (g)-->(:file)-->(s:study)
        WITH g, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH g, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        RETURN output
    """;
}
