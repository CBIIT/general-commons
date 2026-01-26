package gov.nih.nci.bento_ri.model.cypher_queries;

public class CompositionQuery {
    public static final String COMPOSITIONS_QUERY = """
        MATCH (comp:Composition)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        WHERE
            ($composition_ids = [] OR comp.Composition_ID IN $composition_ids)
            AND ($sample_ids = [] OR samp.sample_id IN $sample_ids)
        WITH DISTINCT comp, samp, s
        ORDER BY comp.Composition_ID ASC
        RETURN comp {.*, phs_accession: s.phs_accession, sample_id: samp.sample_id} AS output
    """;

    public static final String COMPOSITIONS_COUNT_QUERY = """
        MATCH (comp:Composition)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT comp) AS count
    """;
}
