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
                        .dataFetcher("schemaVersion", env -> "3.0.0")
                        .dataFetcher("schemaModelVersion", env -> "8.0.0")
                        .dataFetchers(yamlQueryFactory.createYamlQueries(Const.ES_ACCESS_TYPE.PRIVATE))
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
                )
                .build();
    }

}
