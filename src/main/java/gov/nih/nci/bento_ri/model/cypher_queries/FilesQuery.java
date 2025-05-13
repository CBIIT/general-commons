package gov.nih.nci.bento_ri.model.cypher_queries;

public class FilesQuery {
    public static final String FILES_QUERY = """
        MATCH (f:file)
        WHERE
            ($file_ids = [] OR f.file_id IN $file_ids) AND
            ($file_names = [] OR f.file_name IN $file_names) AND
            ($file_types = [] OR f.file_type IN $file_types)
        WITH f, f {.*} AS output
        OPTIONAL MATCH (f)-->(s:study)
        WITH f, s, output
        WHERE
            $phs_accessions = [] OR s.phs_accession in $phs_accessions
        WITH f, apoc_replacement_poc.merge(output, {
            phs_accession: s.phs_accession
        }) AS output
        OPTIONAL MATCH (f)-->(p:participant)
        WITH f, p, output
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH f, apoc_replacement_poc.merge(output, {
            participant_ids: COLLECT(DISTINCT p.participant_id)
        }) AS output
        RETURN output
    """;
}
