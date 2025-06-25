package gov.nih.nci.bento_ri.model.cypher_queries;

public class FilesQuery {
    public static final String FILES_QUERY = """
        MATCH (f:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WITH DISTINCT f, s
        WHERE
            ($file_ids = [] OR f.file_id IN $file_ids) AND
            ($file_names = [] OR f.file_name IN $file_names) AND
            ($file_types = [] OR f.file_type IN $file_types) AND
            ($released_range_start = "" OR timestamp(dateTime(toString(f.release_datetime))) >= timestamp(dateTime($released_range_start))) AND
            ($released_range_end = "" OR timestamp(dateTime(toString(f.release_datetime))) <= timestamp(dateTime($released_range_end)))
        WITH f, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (f)-->(p:participant)
        WITH f, p, output
        WHERE
            $participant_ids = [] OR p.participant_id IN $participant_ids
        WITH f, output, COLLECT(DISTINCT p.participant_id) AS participant_ids
        WITH f, apoc_replacement_poc.merge(output, {
            participant_ids: participant_ids
        }) AS output
        WITH apoc_replacement_poc.merge(output, f {.*}) AS output
        RETURN output
        ORDER BY output.file_id ASC
    """;

    public static final String FILES_COUNT_QUERY = """
        MATCH (f:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT f) AS count
    """;
}
