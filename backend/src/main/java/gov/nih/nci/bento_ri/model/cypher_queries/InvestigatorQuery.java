package gov.nih.nci.bento_ri.model.cypher_queries;

public class InvestigatorQuery {
    public static final String INVESTIGATORS_QUERY = """
        MATCH (inv:investigator)-->(s:study{phs_accession: $phs_accession})
        WHERE
            $investigator_ids = [] OR inv.investigator_id IN $investigator_ids
        WITH DISTINCT inv, s
        ORDER BY inv.investigator_id ASC
        RETURN inv {.*, phs_accession: s.phs_accession} AS output
    """;

    public static final String INVESTIGATORS_COUNT_QUERY = """
        MATCH (inv:investigator)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT inv) AS count
    """;
}
