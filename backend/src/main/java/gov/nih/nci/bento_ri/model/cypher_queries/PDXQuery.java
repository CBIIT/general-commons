package gov.nih.nci.bento_ri.model.cypher_queries;

public class PDXQuery {
    public static final String PDX_QUERY = """
        MATCH (p:pdx)-[:from_sample]->(samp:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            ($pdx_ids = [] OR p.pdx_id IN $pdx_ids) AND
            ($sample_ids = [] OR samp.sample_id IN $sample_ids)
        RETURN
            p {.*,
            phs_accession: s.phs_accession,
            sample_id: samp.sample_id} AS output
        ORDER BY output.pdx_id ASC
    """;

    public static final String PDX_COUNT_QUERY = """
        MATCH (p:pdx)-[:from_sample]->(:sample)-[:of_participant]->(:participant)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT p) AS count
    """;
}
