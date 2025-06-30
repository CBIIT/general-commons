package gov.nih.nci.bento_ri.model.cypher_queries;

public class NonDICOMradiologyAllModalitiesQuery {
    public static final String NON_DICOM_RADIOLOGY_ALL_MODALITIES_QUERY = """
        MATCH (x:NonDICOMradiologyAllModalities)-[:of_image]->(:image)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        WHERE
            $non_dicom_radiology_all_modalities_ids = [] OR x.NonDICOMradiologyAllModalities_id IN $non_dicom_radiology_all_modalities_ids
        WITH x, {phs_accession: s.phs_accession} AS output
        OPTIONAL MATCH (x)-->(:image)-->(f:file)
        WITH x, f, output
        WHERE
            $file_ids = [] OR f.file_id IN $file_ids
        WITH x, apoc_replacement_poc.merge(output, {
            file_id: f.file_id
        }) AS output
        WITH apoc_replacement_poc.merge(output, x {.*}) AS output
        RETURN output
        ORDER BY output.non_dicom_radiology_all_modalities_id ASC
    """;

    public static final String NON_DICOM_RADIOLOGY_ALL_MODALITIES_COUNT_QUERY = """
        MATCH (x:NonDICOMradiologyAllModalities)-[:of_image]->(:image)-[:of_file]->(:file)-[:of_study]->(s:study {phs_accession: $phs_accession})
        RETURN COUNT(DISTINCT x) AS count
    """;
}
