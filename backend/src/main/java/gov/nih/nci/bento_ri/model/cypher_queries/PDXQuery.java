package gov.nih.nci.bento_ri.model.cypher_queries;

public class PDXQuery {
    public static final String PDX_QUERY = """
        MATCH (p:pdx)-[:of_sample]->(:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $pdx_ids = [] OR p.pdx_id IN $pdx_ids
        WITH p, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (x)-->(samp:sample)
        WITH p, samp, output
        WHERE
            $sample_ids = [] OR samp.sample_id IN $sample_ids
        WITH p, apoc_replacement_poc.merge(output, {
            sample_id: samp.sample_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, p {.*}) AS output
        RETURN output
        ORDER BY output.pdx_id ASC
    """;

    public static final String PDX_COUNT_QUERY = """
        MATCH (p:pdx)-[:of_sample]->(:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT p) AS count
    """;
}
