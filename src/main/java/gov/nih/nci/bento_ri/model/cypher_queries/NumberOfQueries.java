package gov.nih.nci.bento_ri.model.cypher_queries;

public class NumberOfQueries {
    private static final String TEMPLATE = """
        MATCH (n:%s)
        RETURN COUNT(DISTINCT n) AS count
    """;

    private static String getNumberOfQuery(String nodeType){
        return String.format(TEMPLATE, nodeType);
    }

    public static String getNumberOfProgramsQuery(){
        return getNumberOfQuery("program");
    }

    public static String getNumberOfStudiesQuery(){
        return getNumberOfQuery("study");
    }

    public static String getNumberOfParticipantsQuery(){
        return getNumberOfQuery("participant");
    }
    
    public static String getNumberOfSamplesQuery(){
        return getNumberOfQuery("sample");
    }
    
    public static String getNumberOfFilesQuery(){
        return getNumberOfQuery("file");
    }
    
    public static String getNumberOfDiagnosesQuery(){
        return getNumberOfQuery("diagnosis");
    }
    
    public static String getNumberOfTreatmentsQuery(){
        return getNumberOfQuery("treatment");
    }
    
    public static String getNumberOfImagesQuery(){
        return getNumberOfQuery("image");
    }
    
    public static String getNumberOfGenomicInfoQuery(){
        return getNumberOfQuery("genomic_info");
    }
    
    public static String getNumberOfProteomicsQuery(){
        return getNumberOfQuery("proteomic");
    }
    
    public static String getNumberOfPDXQuery(){
        return getNumberOfQuery("pdx");
    }
    
    public static String getNumberOfMultiplexMicroscopiesQuery(){
        return getNumberOfQuery("multiplex_microscopy");
    }
    
    public static String getNumberOfNonDICOMCTimagesQuery(){
        return getNumberOfQuery("NonDICOMCTimages");
    }
    
    public static String getNumberOfNonDICOMMRimagesQuery(){
        return getNumberOfQuery("NonDICOMMRimages");
    }
    
    public static String getNumberOfNonDICOMPETimagesQuery(){
        return getNumberOfQuery("NonDICOMPETimages");
    }
    
    public static String getNumberOfNonDICOMpathologyImagesQuery(){
        return getNumberOfQuery("NonDICOMpathologyImages");
    }
    
    public static String getNumberOfNonDICOMradiologyAllModalitiesQuery(){
        return getNumberOfQuery("NonDICOMradiologyAllModalities");
    }
    
    public static String getNumberOfVersionsQuery(){
        return getNumberOfQuery("version");
    }
    
}
