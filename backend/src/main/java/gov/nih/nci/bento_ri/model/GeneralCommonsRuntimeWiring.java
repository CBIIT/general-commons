package gov.nih.nci.bento_ri.model;

import gov.nih.nci.bento.constants.Const;
import gov.nih.nci.bento.model.search.yaml.YamlQueryFactory;
import gov.nih.nci.bento.service.ESService;
import graphql.schema.idl.RuntimeWiring;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;

@Getter
@Component
public class GeneralCommonsRuntimeWiring {

    private final RuntimeWiring runtimeWiring;

    public GeneralCommonsRuntimeWiring(
            MemgraphDataFetcher memgraphDataFetcher,
            PrivateESDataFetcher privateESDataFetcher,
            ESService esService
    ) throws IOException {
        YamlQueryFactory yamlQueryFactory = new YamlQueryFactory(esService);
        this.runtimeWiring = RuntimeWiring.newRuntimeWiring()
                .type(newTypeWiring("QueryType")
                        .dataFetcher("schemaVersion", env -> "3.1.0")
                        .dataFetcher("schemaModelVersion", env -> "8.0.1")
                        .dataFetchers(yamlQueryFactory.createYamlQueries(Const.ES_ACCESS_TYPE.PRIVATE))
                        .dataFetcher("idsLists", env -> {
                            return privateESDataFetcher.idsLists();
                        })
                        .dataFetcher("searchSubjects", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.searchSubjects(args);
                        })
                        .dataFetcher("subjectOverview", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.subjectOverview(args);
                        })
                        .dataFetcher("sampleOverview", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.sampleOverview(args);
                        })
                        .dataFetcher("fileOverview", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.fileOverview(args);
                        })
                        .dataFetcher("filesInList", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.filesInList(args);
                        })
                        .dataFetcher("globalSearch", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.globalSearch(args);
                        })
                        .dataFetcher("fileIDsFromList", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.fileIDsFromList(args);
                        })
                        .dataFetcher("findSubjectIdsInList", env -> {
                            Map<String, Object> args = env.getArguments();
                            return privateESDataFetcher.findSubjectIdsInList(args);
                        })
                        // memgraph queries
                        .dataFetcher("programs", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.programDataFetcher(args);
                        })
                        .dataFetcher("version", env -> {
                            return memgraphDataFetcher.versionDataFetcher();
                        })
                        .dataFetcher("studies", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.studyDataFetcher(args);
                        })
                        .dataFetcher("files", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.fileDataFetcher(args);
                        })
                        .dataFetcher("participants", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.participantDataFetcher(args);
                        })
                        .dataFetcher("samples", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.samplesDataFetcher(args);
                        })
                        .dataFetcher("treatments", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.treatmentsDataFetcher(args);
                        })
                        .dataFetcher("diagnoses", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.diagnosesDataFetcher(args);
                        })
                        .dataFetcher("genomic_info", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.genomicInfoDataFetcher(args);
                        })
                        .dataFetcher("proteomics", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.proteomicsDataFetcher(args);
                        })
                        .dataFetcher("images", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.imagesDataFetcher(args);
                        })
                        .dataFetcher("multiplex_microscopies", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.multiplexMicroscopiesDataFetcher(args);
                        })
                        .dataFetcher("non_dicomct_images", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.nonDICOMCTimagesDataFetcher(args);
                        })
                        .dataFetcher("non_dicommr_images", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.nonDICOMMRimagesDataFetcher(args);
                        })
                        .dataFetcher("non_dicom_pathology_images", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.nonDICOMpathologyImagesDataFetcher(args);
                        })
                        .dataFetcher("non_dicompet_images", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.nonDICOMPETimagesDataFetcher(args);
                        })
                        .dataFetcher("non_dicom_radiology_all_modalities", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.nonDICOMradiologyAllModalitiesDataFetcher(args);
                        })
                        .dataFetcher("pdx", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.pdxDataFetcher(args);
                        })
                        .dataFetcher("investigators", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.investigatorDataFetcher(args);
                        })
                        .dataFetcher("characterizations", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.characterizationDataFetcher(args);
                        })
                        .dataFetcher("publications", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.publicationDataFetcher(args);
                        })
                        .dataFetcher("protocols", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.protocolDataFetcher(args);
                        })
                        .dataFetcher("compositions", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.compositionDataFetcher(args);
                        })
                        .dataFetcher("consent_groups", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.consentGroupDataFetcher(args);
                        })
                        // Memgraph node count queries
                        .dataFetcher("programsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfPrograms(args);
                        })
                        .dataFetcher("studiesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfStudies(args);
                        })
                        .dataFetcher("participantsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfParticipants(args);
                        })
                        .dataFetcher("samplesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfSamples(args);
                        })
                        .dataFetcher("filesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfFiles(args);
                        })
                        .dataFetcher("diagnosesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfDiagnoses(args);
                        })
                        .dataFetcher("treatmentsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfTreatments(args);
                        })
                        .dataFetcher("imagesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfImages(args);
                        })
                        .dataFetcher("genomicInfoCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfGenomicInfo(args);
                        })
                        .dataFetcher("proteomicsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfProteomics(args);
                        })
                        .dataFetcher("pdxCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfPDX(args);
                        })
                        .dataFetcher("multiplexMicroscopiesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfMultiplexMicroscopies(args);
                        })
                        .dataFetcher("nonDICOMCTimagesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfNonDICOMCTimages(args);
                        })
                        .dataFetcher("nonDICOMMRimagesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfNonDICOMMRimages(args);
                        })
                        .dataFetcher("nonDICOMPETimagesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfNonDICOMPETimages(args);
                        })
                        .dataFetcher("nonDICOMpathologyImagesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfNonDICOMpathologyImages(args);
                        })
                        .dataFetcher("nonDICOMradiologyAllModalitiesCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfNonDICOMradiologyAllModalities(args);
                        })
                        .dataFetcher("investigatorsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfInvestigators(args);
                        })
                        .dataFetcher("characterizationsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfCharacterizations(args);
                        })
                        .dataFetcher("publicationsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfPublications(args);
                        })
                        .dataFetcher("protocolsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfProtocols(args);
                        })
                        .dataFetcher("compositionsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfCompositions(args);
                        })
                        .dataFetcher("consentGroupsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfConsentGroups(args);
                        })
                        .dataFetcher("versionsCount", env -> {
                            Map<String, Object> args = env.getArguments();
                            return memgraphDataFetcher.getNumberOfVersions(args);
                        })
                        // numberOf... queries (replacing YAML-based queries) - total counts, no arguments required
                        .dataFetcher("numberOfStudies", env -> {
                            return memgraphDataFetcher.getTotalNumberOfStudies();
                        })
                        .dataFetcher("numberOfSubjects", env -> {
                            return memgraphDataFetcher.getTotalNumberOfParticipants();
                        })
                        .dataFetcher("numberOfSamples", env -> {
                            return memgraphDataFetcher.getTotalNumberOfSamples();
                        })
                        .dataFetcher("numberOfFiles", env -> {
                            return memgraphDataFetcher.getTotalNumberOfFiles();
                        })
                        .dataFetcher("numberOfDiseaseSites", env -> {
                            return memgraphDataFetcher.getTotalNumberOfDiseaseSites();
                        })
                        .dataFetcher("numberOfImages", env -> {
                            return memgraphDataFetcher.getTotalNumberOfImages();
                        })
                        .dataFetcher("numberOfProteomics", env -> {
                            return memgraphDataFetcher.getTotalNumberOfProteomics();
                        })
                )
                .build();
    }

}
