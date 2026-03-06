package gov.nih.nci.bento_ri.model.cypher_queries;

public class PublicationQuery {
    public static final String PUBLICATIONS_QUERY = """
        MATCH (pub:Publication)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        WHERE
            ($publication_ids = [] OR pub.DOI_or_Pub_ID IN $publication_ids)
            AND ($sample_ids = [] OR samp.sample_id IN $sample_ids)
        WITH DISTINCT pub, samp, s
        ORDER BY pub.DOI_or_Pub_ID ASC
        RETURN pub {.*, phs_accession: s.phs_accession, sample_id: samp.sample_id} AS output
    """;

    public static final String PUBLICATIONS_COUNT_QUERY = """
        MATCH (pub:Publication)-->(samp:sample)-->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT pub) AS count
    """;
}
