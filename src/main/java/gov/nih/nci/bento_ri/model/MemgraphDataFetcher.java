package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento_ri.model.cypher_queries.*;
import org.neo4j.driver.Result;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import gov.nih.nci.bento.model.ConfigurationDAO;
import org.neo4j.driver.*;
import org.springframework.stereotype.Component;

@Component
public class MemgraphDataFetcher implements AutoCloseable{
    private final int MAX_PAGE_SIZE = 10000;
    private final ConfigurationDAO config;
    private Driver driver;

    public MemgraphDataFetcher(ConfigurationDAO config) {
        this.config = config;
        connect();
    }

    private void connect() {
        String endpoint = config.getMemgraphEndpoint();
        String [] endpointParts = endpoint.split("://");
        // check for bolt prefix then add if necessary
        if (endpointParts.length == 1){
            endpoint = "bolt://"+endpoint;
        }
        else if (endpointParts.length > 1 && !endpointParts[0].equalsIgnoreCase("bolt")){
            endpointParts[0] = "bolt";
            endpoint = String.join("://", endpointParts);
        }
        String uri = endpoint+":"+config.getMemgraphPort();
        String user = config.getMemgraphUsername();
        String password = config.getMemgraphPassword();
        driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
    }

    @Override
    public void close() throws Exception {
        driver.close();
    }

    public List<Map<String, Object>> programDataFetcher(Map<String, Object> params){
        return listQuery(ProgramsQuery.PROGRAMS_QUERY, params);
    }

    public Map<String, Object> versionDataFetcher(){
        return mapQuery(VersionQuery.VERSION_QUERY, new HashMap<>());
    }

    public List<Map<String, Object>> studyDataFetcher(Map<String, Object> params){
        return listQuery(StudiesQuery.STUDIES_QUERY, params);
    }

    public List<Map<String, Object>> fileDataFetcher(Map<String, Object> params){
        // validate date inputs
        final String startKey = "released_range_start";
        final String endKey = "released_range_end";
        Map<String, Object> modifiedParams = new HashMap<>(params);
        String dateError = "The optional parameter %s must be a valid date in the format YYYY-MM-DD";
        String releasedRangeStart = params.get(startKey).toString();
        if (!releasedRangeStart.isEmpty()){
            if (!validateDateInput(releasedRangeStart)){
                throw new IllegalArgumentException(String.format(dateError, startKey));
            }
            modifiedParams.put(startKey, releasedRangeStart+"T00:00:00Z");
        }
        String releasedRangeEnd = params.get(endKey).toString();
        if (!releasedRangeEnd.isEmpty()){
            if (!validateDateInput(releasedRangeEnd)){
                throw new IllegalArgumentException(String.format(dateError, endKey));
            }
            modifiedParams.put(endKey, releasedRangeEnd+"T23:59:59Z");
        }
        return listQuery(FilesQuery.FILES_QUERY, modifiedParams);
    }

    public List<Map<String, Object>> participantDataFetcher(Map<String, Object> params){
        return listQuery(ParticipantsQuery.PARTICIPANTS_QUERY, params);
    }

    public List<Map<String, Object>> samplesDataFetcher(Map<String, Object> params){
        return listQuery(SamplesQuery.SAMPLES_QUERY, params);
    }

    public List<Map<String, Object>> treatmentsDataFetcher(Map<String, Object> params){
        return listQuery(TreatmentsQuery.TREATMENTS_QUERY, params);
    }

    public List<Map<String, Object>> diagnosesDataFetcher(Map<String, Object> params){
        return listQuery(DiagnosesQuery.DIAGNOSES_QUERY, params);
    }

    public List<Map<String, Object>> genomicInfoDataFetcher(Map<String, Object> params){
        return listQuery(GenomicInfoQuery.GENOMIC_INFO_QUERY, params);
    }

    public List<Map<String, Object>> proteomicsDataFetcher(Map<String, Object> params){
        return listQuery(ProteomicsQuery.PROTEOMICS_QUERY, params);
    }

    public List<Map<String, Object>> imagesDataFetcher(Map<String, Object> params){
        return listQuery(ImagesQuery.IMAGES_QUERY, params);
    }

    public List<Map<String, Object>> multiplexMicroscopiesDataFetcher(Map<String, Object> params){
        return listQuery(MultiplexMicroscopiesQuery.MULTIPLEX_MICROSCOPIES_QUERY, params);
    }

    public List<Map<String, Object>> nonDICOMCTimagesDataFetcher(Map<String, Object> params){
        return listQuery(NonDICOMCTimagesQuery.NON_DICOMCT_IMAGES_QUERY, params);
    }

    public List<Map<String, Object>> nonDICOMMRimagesDataFetcher(Map<String, Object> params){
        return listQuery(NonDICOMMRimagesQuery.NON_DICOMMR_IMAGES_QUERY, params);
    }

    public List<Map<String, Object>> nonDICOMpathologyImagesDataFetcher(Map<String, Object> params){
        return listQuery(NonDICOMpathologyImagesQuery.NON_DICOM_PATHOLOGY_IMAGES_QUERY, params);
    }

    public List<Map<String, Object>> nonDICOMPETimagesDataFetcher(Map<String, Object> params){
        return listQuery(NonDICOMPETimagesQuery.NON_DICOMPET_IMAGES_QUERY, params);
    }

    public List<Map<String, Object>> nonDICOMradiologyAllModalitiesDataFetcher(Map<String, Object> params){
        return listQuery(NonDICOMradiologyAllModalitiesQuery.NON_DICOM_RADIOLOGY_ALL_MODALITIES_QUERY, params);
    }

    public List<Map<String, Object>> pdxDataFetcher(Map<String, Object> params){
        return listQuery(PDXQuery.PDX_QUERY, params);
    }
    
    // NumberOf query data fetchers
    public Long getNumberOfPrograms(){
        return countQuery(NumberOfQueries.getNumberOfProgramsQuery());
    }
    
    public Long getNumberOfStudies(){
        return countQuery(NumberOfQueries.getNumberOfStudiesQuery());
    }
    
    public Long getNumberOfParticipants(){
        return countQuery(NumberOfQueries.getNumberOfParticipantsQuery());
    }
    
    public Long getNumberOfSamples(){
        return countQuery(NumberOfQueries.getNumberOfSamplesQuery());
    }
    
    public Long getNumberOfFiles(){
        return countQuery(NumberOfQueries.getNumberOfFilesQuery());
    }
    
    public Long getNumberOfDiagnoses(){
        return countQuery(NumberOfQueries.getNumberOfDiagnosesQuery());
    }
    
    public Long getNumberOfTreatments(){
        return countQuery(NumberOfQueries.getNumberOfTreatmentsQuery());
    }
    
    public Long getNumberOfImages(){
        return countQuery(NumberOfQueries.getNumberOfImagesQuery());
    }
    
    public Long getNumberOfGenomicInfo(){
        return countQuery(NumberOfQueries.getNumberOfGenomicInfoQuery());
    }
    
    public Long getNumberOfProteomics(){
        return countQuery(NumberOfQueries.getNumberOfProteomicsQuery());
    }
    
    public Long getNumberOfPDX(){
        return countQuery(NumberOfQueries.getNumberOfPDXQuery());
    }
    
    public Long getNumberOfMultiplexMicroscopies(){
        return countQuery(NumberOfQueries.getNumberOfMultiplexMicroscopiesQuery());
    }
    
    public Long getNumberOfNonDICOMCTimages(){
        return countQuery(NumberOfQueries.getNumberOfNonDICOMCTimagesQuery());
    }
    
    public Long getNumberOfNonDICOMMRimages(){
        return countQuery(NumberOfQueries.getNumberOfNonDICOMMRimagesQuery());
    }
    
    public Long getNumberOfNonDICOMPETimages(){
        return countQuery(NumberOfQueries.getNumberOfNonDICOMPETimagesQuery());
    }
    
    public Long getNumberOfNonDICOMpathologyImages(){
        return countQuery(NumberOfQueries.getNumberOfNonDICOMpathologyImagesQuery());
    }
    
    public Long getNumberOfNonDICOMradiologyAllModalities(){
        return countQuery(NumberOfQueries.getNumberOfNonDICOMradiologyAllModalitiesQuery());
    }
    
    public Long getNumberOfVersions(){
        return countQuery(NumberOfQueries.getNumberOfVersionsQuery());
    }
    

    private Map<String, Object> mapQuery(String query, Map<String, Object> params){
        try (Session session = driver.session()) {
            Result result = session.run(query, params);
            Map<String, Object> output = new HashMap<>();
            if (result.hasNext()){
                output = result.single().get("output").asMap();
            }
            return output;
        }
    }

    private List<Map<String, Object>> listQuery(String query, Map<String, Object> params){
        // add pagination cypher to query
        int first = parseIntParameter(params.get("first"), "$first", 0, MAX_PAGE_SIZE);
        int offset = parseIntParameter(params.get("offset"), "$offset", 0, Integer.MAX_VALUE);
        query += "\n"+String.format("SKIP %d LIMIT %d", offset, first);
        // execute the query
        try (Session session = driver.session()) {
            Result result = session.run(query, params);
            return result.list(record -> record.get("output").asMap());
        }
    }

    private int parseIntParameter(Object param, String name, int min, int max){
        if (!(param instanceof Integer)){
            throw new IllegalArgumentException(String.format("The %s parameter must be an integer", name));
        }
        int intParam = (int) param;
        if (intParam < min || intParam > max){
            throw new IllegalArgumentException(String.format("The %s parameter must be between %d and %d", name, min, max));
        }
        return intParam;
    }

    private boolean validateDateInput(String date){
        String dateRegex = "^\\d{4}-\\d{2}-\\d{2}$";
        if (!date.matches(dateRegex)) {
            return false;
        }
        try{
            String[] parts = date.split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            int day = Integer.parseInt(parts[2]);
            if (year < 1 || month < 1 || month > 12 || day < 1 || day > getDaysInMonth(month, year)){
                return false;
            }
        }
        catch (NumberFormatException e){
            return false;
        }
        return true;
    }

    private int getDaysInMonth(int month, int year){
        if (month == 2 && year % 4 == 0){
            return 29;
        }
        int[] daysInMonth = {0,31,28,31,30,31,30,31,31,30,31,30,31};
        return daysInMonth[month];
    }

    private Long countQuery(String query){
        try (Session session = driver.session()) {
            Result result = session.run(query);
            return result.single().get("count").asLong();
        }
    }

}


