package gov.nih.nci.bento_ri.model.cypher_queries;

public class ConsentGroupQuery {
    public static final String CONSENT_GROUPS_QUERY = """
        MATCH (cg:consent_group)-->(s:study {phs_accession: $phs_accession})
        WHERE
            $consent_group_ids = [] OR cg.consent_group_id IN $consent_group_ids
        WITH DISTINCT cg, s
        ORDER BY cg.consent_group_id ASC
        RETURN cg {.*, phs_accession: s.phs_accession} AS output
    """;

    public static final String CONSENT_GROUPS_COUNT_QUERY = """
        MATCH (cg:consent_group)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT cg) AS count
    """;
}
