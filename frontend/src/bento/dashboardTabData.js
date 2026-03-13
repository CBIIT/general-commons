/* eslint-disable */
import gql from 'graphql-tag';
import { cellTypes } from '@bento-core/table';
import { customCasesTabDownloadCSV, customFilesTabDownloadCSV, customSamplesTabDownloadCSV } from './tableDownloadCSV';
import { dataFormatTypes } from '@bento-core/table';
import { STATIC_CONTENT } from '../assets/staticContent';

// --------------- Tooltip configuration --------------
export const addAllFilesButtonTooltipConfig = {
  title: 'Click to add all files associated with the study.',
  arrow: true,
  placement: 'top',
};

export const addSelectedFilesButtonTooltipConfig = {
  title: 'Click to add only the files you have selected associated with the participants or samples.',
  arrow: true,
  placement: 'top',
};

// --------------- Dahboard Table external link configuration --------------
// Ideal size for externalLinkIcon is 16x16 px
export const externalLinkIcon = {
  src: STATIC_CONTENT.icons.EXTERNAL_LINK_ICON_SVG,
  alt: 'External link icon',
};

// --------------- Tabs Index Mapping --------------
export const tabIndexMap = {
  'participants': 0,
  'samples': 1,
  'files': 2,
  'protocols': 3,
};

// --------------- Tabs Header Data configuration --------------
export const tabs = [
  {
    id: 'case_tab',
    title: 'Cases',
    dataField: 'dataCase',
    count: 'numberOfSubjects',
  },
  {
    id: 'sample_tab',
    title: 'Samples',
    dataField: 'dataSample',
    count: 'numberOfSamples',
  },
  {
    id: 'file_tab',
    title: 'Files',
    dataField: 'dataFile',
    count: 'numberOfFiles',
  },
  {
    id: 'protocol_tab',
    title: 'Protocols',
    dataField: 'dataProtocol',
    count: 'numberOfProtocols',
  },
];

// --------------- Tabs Header Style configuration --------------
export const tabIndex = [
  {
    title: 'Cases',
    primaryColor: '#D6F2EA',
    secondaryColor: '#FFDFB8',
    selectedColor: '#10A075',
  },
  {
    title: 'Samples',
    primaryColor: '#CFEDF9',
    secondaryColor: '#C9F1F1',
    selectedColor: '#0DAFEC',
  },
  {
    title: 'Files',
    primaryColor: '#F7D7F7',
    secondaryColor: '#86D6F0',
    selectedColor: '#C92EC7',
  },
];

export const DASHBOARD_QUERY = gql`
query searchSubjects(
  $subject_ids: [String], 
  $accesses: [String], 
  $acl: [String], 
  $experimental_strategies: [String], 
  $file_types: [String], 
  $sex: [String], 
  $image_modality: [String], 
  $instrument_models: [String], 
  $is_tumor: [String], 
  $library_layouts: [String], 
  $library_selections: [String], 
  $library_source_materials: [String], 
  $library_source_molecules: [String], 
  $library_strategies: [String], 
  $number_of_study_participants: [Float], 
  $number_of_study_samples: [Float], 
  $phs_accession: [String], 
  $platforms: [String], 
  $primary_diagnoses: [String], 
  $reference_genome_assemblies: [String], 
  $sample_types: [String], 
  $site: [String], 
  $studies: [String], 
  $study_data_types: [String], 
  $analytical_fractions: [String], 
  $instrument_makes: [String], 
  $proteomic_design_descriptions: [String], 
  $organ_or_tissue: [String], 
  $tissue_fixative: [String], $imaging_assay_type: [String], 
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],
  ){
    searchSubjects(
    subject_ids: $subject_ids, 
    accesses: $accesses, 
    acl: $acl, 
    experimental_strategies: $experimental_strategies, 
    file_types: $file_types, 
    sex: $sex, 
    image_modality: $image_modality, 
    instrument_models: $instrument_models, 
    is_tumor: $is_tumor, 
    library_layouts: $library_layouts, 
    library_selections: $library_selections, 
    library_source_materials: $library_source_materials, 
    library_source_molecules: $library_source_molecules, 
    library_strategies: $library_strategies, 
    number_of_study_participants: $number_of_study_participants, 
    number_of_study_samples: $number_of_study_samples, 
    phs_accession: $phs_accession, 
    platforms: $platforms, 
    primary_diagnoses: $primary_diagnoses, 
    reference_genome_assemblies: $reference_genome_assemblies, 
    sample_types: $sample_types, 
    site: $site, 
    studies: $studies, 
    study_data_types: $study_data_types, 
    analytical_fractions: $analytical_fractions, 
    instrument_makes: $instrument_makes, 
    proteomic_design_descriptions: $proteomic_design_descriptions, 
    organ_or_tissue: $organ_or_tissue, 
    tissue_fixative: $tissue_fixative, 
    imaging_assay_type: $imaging_assay_type, 
    is_supplementary_file: $is_supplementary_file,
    protocol_names: $protocol_names,
    protocol_types: $protocol_types,
    dois: $dois,
    publication_titles: $publication_titles,
    publication_statuses: $publication_statuses,
    pub_ids: $pub_ids,
    nanomaterial_entities: $nanomaterial_entities,
    functionalizing_entities: $functionalizing_entities,
    characterization_types: $characterization_types,
    characterization_names: $characterization_names
    ){
        numberOfStudies
        numberOfSubjects
        numberOfSamples
        numberOfFiles
        numberOfProtocols
        numberOfDiseaseSites
        donutCountByExperimentalStrategy{
            group
            subjects
        }
        donutCountBySex{
            group
            subjects
        }
        donutCountByFileType{
            group
            subjects
        }
        donutCountByStudyDataTypes{
            group
            subjects
        }
        donutCountByImageModality{
            group
            subjects
        }
        donutCountBySampleType{
            group
            subjects
        }
        subjectCountByStudy{
            group
            subjects
        }
        subjectCountByExperimentalStrategy{
            group
            subjects
        }
        subjectCountByAccess{
            group
            subjects
        }
        subjectCountBySex{
            group
            subjects
        }
        subjectCountByIsTumor{
            group
            subjects
        }
        subjectCountByAnalyteType{
            group
            subjects
        }
        subjectCountByFileType{
            group
            subjects
        }
        subjectCountByDiseaseSite{
            group
            subjects
        }
        subjectCountByLibraryStrategy{
            group
            subjects
        }
        subjectCountByLibrarySourceMaterial{
            group
            subjects
        }
        subjectCountByLibrarySourceMolecule{
            group
            subjects
        }
        subjectCountByLibrarySelection{
            group
            subjects
        }
        subjectCountByLibraryLayout{
            group
            subjects
        }
        subjectCountByPlatform{
            group
            subjects
        }
        subjectCountByImageModality{
            group
            subjects
        }
        subjectCountByInstrumentModel{
            group
            subjects
        }
        subjectCountByReferenceGenomeAssembly{
            group
            subjects
        }
        subjectCountByPrimaryDiagnosis{
            group
            subjects
        }
        subjectCountByPhsAccession{
            group
            subjects
        }
        subjectCountBySampleType{
            group
            subjects
        }
        subjectCountByStudyDataType{
            group
            subjects
        }
        subjectCountByAcl{
            group
            subjects
        }
        subjectCountByAnalyticalFractions{
            group
            subjects
        }
        subjectCountByInstrumentMakes{
            group
            subjects
        }
        subjectCountByProteomicDesignDescriptions{
            group
            subjects
        }
        subjectCountByTissueFixative{
            group
            subjects
        }
        subjectCountByImagingAssayType{
            group
            subjects
        }
        subjectCountByOrganOrTissue{
            group
            subjects
        }
        subjectCountByIsSupplementaryFile{
            group
            subjects
        }
        subjectCountByProtocolName{
            group
            subjects
        }
        subjectCountByProtocolType{
            group
            subjects
        }
        subjectCountByDoi{
            group
            subjects
        }
        subjectCountByDoiUrl{
            group
            subjects
        }    
        subjectCountByPublicationTitle{
            group
            subjects
        }
        subjectCountByPublicationStatus{
            group
            subjects
        }
        subjectCountByPubId{
            group
            subjects
        }
        subjectCountByNanomaterialEntity{
            group
            subjects
        }
        subjectCountByFunctionalizingEntity{
            group
            subjects
        }
        subjectCountByCharacterizationType{
            group
            subjects
        }
        subjectCountByCharacterizationName{
            group
            subjects
        }
        filterSubjectCountByStudy{
            group
            subjects
        }
        filterSubjectCountByExperimentalStrategy{
            group
            subjects
        }
        filterSubjectCountByAccess{
            group
            subjects
        }
        filterSubjectCountBySex{
            group
            subjects
        }
        filterSubjectCountByIsTumor{
            group
            subjects
        }
        filterSubjectCountByFileType{
            group
            subjects
        }
        filterSubjectCountByAnalyteType{
            group
            subjects
        }
        filterSubjectCountByDiseaseSite{
            group
            subjects
        }
        filterSubjectCountByLibraryStrategy{
            group
            subjects
        }
        filterSubjectCountByLibrarySourceMaterial{
            group
            subjects
        }
        filterSubjectCountByLibrarySourceMolecule{
            group
            subjects
        }
        filterSubjectCountByLibrarySelection{
            group
            subjects
        }
        filterSubjectCountByLibraryLayout{
            group
            subjects
        }
        filterSubjectCountByPlatform{
            group
            subjects
        }
        filterSubjectCountByImageModality{
            group
            subjects
        }
        filterSubjectCountByInstrumentModel{
            group
            subjects
        }
        filterSubjectCountByReferenceGenomeAssembly{
            group
            subjects
        }
        filterSubjectCountByPrimaryDiagnosis{
            group
            subjects
        }
        filterSubjectCountByPhsAccession{
            group
            subjects
        }
        filterSubjectCountBySampleType{
            group
            subjects
        }
        filterSubjectCountByStudyDataType{
            group
            subjects
        }
        filterSubjectCountByNumberOfStudyParticipants{
            lowerBound
            upperBound
            subjects
        }
        filterSubjectCountByNumberOfStudySamples{
            lowerBound
            upperBound
            subjects
        }
        filterSubjectCountByAnalyticalFractions{
            group
            subjects
        }
        filterSubjectCountByInstrumentMakes{
            group
            subjects
        }
        filterSubjectCountByProteomicDesignDescriptions{
            group
            subjects
        }
        filterSubjectCountByTissueFixative{
            group
            subjects
        }
        filterSubjectCountByImagingAssayType{
            group
            subjects
        }
        filterSubjectCountByOrganOrTissue{
            group
            subjects
        }
        filterSubjectCountByIsSupplementaryFile{
            group
            subjects
        }
        filterSubjectCountByProtocolName{
            group
            subjects
        }
        filterSubjectCountByProtocolType{
            group
            subjects
        }
        filterSubjectCountByDoi{
            group
            subjects
        }
        filterSubjectCountByDoiUrl{
            group
            subjects
        }
        filterSubjectCountByPublicationTitle{
            group
            subjects
        }
        filterSubjectCountByPublicationStatus{
            group
            subjects
        }
        filterSubjectCountByPubId{
            group
            subjects
        }
        filterSubjectCountByNanomaterialEntity{
            group
            subjects
        }
        filterSubjectCountByFunctionalizingEntity{
            group
            subjects
        }
        filterSubjectCountByCharacterizationType{
            group
            subjects
        }
        filterSubjectCountByCharacterizationName{
            group
            subjects
        }
    }
}
`;

// --------------- GraphQL query - Fetch data for individual tabs --------------

export const GET_CASES_OVERVIEW_QUERY = gql`
query subjectOverview(
  $subject_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $sex:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],
  $analytical_fractions:[String],
  $instrument_makes:[String],
  $proteomic_design_descriptions:[String],
  $organ_or_tissue:[String],
  $tissue_fixative:[String],
  $imaging_assay_type:[String],
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  subjectOverview(
      subject_ids: $subject_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      sex:$sex,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,
      analytical_fractions:$analytical_fractions,
      instrument_makes:$instrument_makes,
      proteomic_design_descriptions:$proteomic_design_descriptions,
      organ_or_tissue:$organ_or_tissue,
      tissue_fixative:$tissue_fixative,
      imaging_assay_type:$imaging_assay_type,
      is_supplementary_file: $is_supplementary_file,
      protocol_names: $protocol_names,
      protocol_types: $protocol_types,
      dois: $dois,
      publication_titles: $publication_titles,
      publication_statuses: $publication_statuses,
      pub_ids: $pub_ids,
      nanomaterial_entities: $nanomaterial_entities,
      functionalizing_entities: $functionalizing_entities,
      characterization_types: $characterization_types,
      characterization_names: $characterization_names,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  ){
      subject_id
      study_participant_id
      study_acronym
      phs_accession
      sex
      site
      samples
      files
      race
      ethnicity
      primary_diagnosis
  }
}
`;

export const GET_FILES_OVERVIEW_QUERY = gql`
query fileOverview(
  $subject_ids: [String],
  $sample_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $sex:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],
  $analytical_fractions:[String],
  $instrument_makes:[String],
  $proteomic_design_descriptions:[String],
  $organ_or_tissue:[String],
  $tissue_fixative:[String],
  $imaging_assay_type:[String],
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  fileOverview(
      subject_ids: $subject_ids,
      sample_ids: $sample_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      sex:$sex,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,
      analytical_fractions:$analytical_fractions,
      instrument_makes:$instrument_makes,
      proteomic_design_descriptions:$proteomic_design_descriptions,
      organ_or_tissue:$organ_or_tissue,
      tissue_fixative:$tissue_fixative,
      imaging_assay_type:$imaging_assay_type,
      is_supplementary_file: $is_supplementary_file,
      protocol_names: $protocol_names,
      protocol_types: $protocol_types,
      dois: $dois,
      publication_titles: $publication_titles,
      publication_statuses: $publication_statuses,
      pub_ids: $pub_ids,
      nanomaterial_entities: $nanomaterial_entities,
      functionalizing_entities: $functionalizing_entities,
      characterization_types: $characterization_types,
      characterization_names: $characterization_names,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  ){
      study_acronym
      phs_accession
      subject_id
      sample_id
      experimental_strategy
      sex
      analyte_type
      study_name
      is_tumor
      file_name
      file_type
      file_size
      file_id
      md5sum
      study_data_type
      library_strategy
      image_modality
      supplementary_file_names
  }
}
`;

export const GET_SAMPLES_OVERVIEW_QUERY = gql`
query sampleOverview(
  $subject_ids: [String],
  $sample_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $sex:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],
  $analytical_fractions:[String],
  $instrument_makes:[String],
  $proteomic_design_descriptions:[String],
  $organ_or_tissue:[String],
  $tissue_fixative:[String],
  $imaging_assay_type:[String],
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  sampleOverview(
      subject_ids: $subject_ids,
      sample_ids: $sample_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      sex:$sex,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,
      analytical_fractions:$analytical_fractions,
      instrument_makes:$instrument_makes,
      proteomic_design_descriptions:$proteomic_design_descriptions,
      organ_or_tissue:$organ_or_tissue,
      tissue_fixative:$tissue_fixative,
      imaging_assay_type:$imaging_assay_type,
      is_supplementary_file: $is_supplementary_file,
      protocol_names: $protocol_names,
      protocol_types: $protocol_types,
      dois: $dois,
      publication_titles: $publication_titles,
      publication_statuses: $publication_statuses,
      pub_ids: $pub_ids,
      nanomaterial_entities: $nanomaterial_entities,
      functionalizing_entities: $functionalizing_entities,
      characterization_types: $characterization_types,
      characterization_names: $characterization_names,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  ){
      study_acronym
      phs_accession
      subject_id
      sample_id
      is_tumor
      analyte_type
      study_name
      sample_name
      organization_name
      files
      sample_type
      sample_tumor_status
      organ_or_tissue
  }
}

`;

export const GET_PROTOCOLS_OVERVIEW_QUERY = gql`
query protocolOverview(
  $protocol_pk_id: [String],
  $protocol_name: [String],
  $protocol_type: [String],
  $doi: [String],
  $doi_url: [String],
  $file_names: [String],
  $acl: [String],
  $accesses: [String],
  $experimental_strategies: [String],
  $file_types: [String],
  $sex: [String],
  $image_modality: [String],
  $instrument_models: [String],
  $is_tumor: [String],
  $library_layouts: [String],
  $library_selections: [String],
  $library_source_materials: [String],
  $library_source_molecules: [String],
  $library_strategies: [String],
  $number_of_study_participants: [Float],
  $number_of_study_samples: [Float],
  $phs_accession: [String],
  $platforms: [String],
  $primary_diagnoses: [String],
  $reference_genome_assemblies: [String],
  $sample_types: [String],
  $site: [String],
  $studies: [String],
  $study_data_types: [String],
  $analytical_fractions: [String],
  $instrument_makes: [String],
  $proteomic_design_descriptions: [String],
  $organ_or_tissue: [String],
  $tissue_fixative: [String],
  $imaging_assay_type: [String],
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $doi_urls: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],
  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  protocolOverview(
      protocol_pk_id: $protocol_pk_id,
      protocol_name: $protocol_name,
      protocol_type: $protocol_type,
      doi: $doi,
      doi_url: $doi_url,
      file_names: $file_names,
      acl: $acl,
      accesses: $accesses,
      experimental_strategies: $experimental_strategies,
      file_types: $file_types,
      sex: $sex,
      image_modality: $image_modality,
      instrument_models: $instrument_models,
      is_tumor: $is_tumor,
      library_layouts: $library_layouts,
      library_selections: $library_selections,
      library_source_materials: $library_source_materials,
      library_source_molecules: $library_source_molecules,
      library_strategies: $library_strategies,
      number_of_study_participants: $number_of_study_participants,
      number_of_study_samples: $number_of_study_samples,
      phs_accession: $phs_accession,
      platforms: $platforms,
      primary_diagnoses: $primary_diagnoses,
      reference_genome_assemblies: $reference_genome_assemblies,
      sample_types: $sample_types,
      site: $site,
      studies: $studies,
      study_data_types: $study_data_types,
      analytical_fractions: $analytical_fractions,
      instrument_makes: $instrument_makes,
      proteomic_design_descriptions: $proteomic_design_descriptions,
      organ_or_tissue: $organ_or_tissue,
      tissue_fixative: $tissue_fixative,
      imaging_assay_type: $imaging_assay_type,
      is_supplementary_file: $is_supplementary_file,
      protocol_names: $protocol_names,
      protocol_types: $protocol_types,
      doi_urls: $doi_urls,
      dois: $dois,
      publication_titles: $publication_titles,
      publication_statuses: $publication_statuses,
      pub_ids: $pub_ids,
      nanomaterial_entities: $nanomaterial_entities,
      functionalizing_entities: $functionalizing_entities,
      characterization_types: $characterization_types,
      characterization_names: $characterization_names,
      order_by: $order_by,
      sort_direction: $sort_direction,
      first: $first,
      offset: $offset
  ){
      protocol_pk_id
      protocol_name
      protocol_type
      doi
      doi_url
      file_names
  }
}

`;

// --------------- GraphQL query - select all check box --------------

export const GET_ALL_FILEIDS_CASESTAB_FOR_SELECT_ALL = gql`
query search (          
  $study_participant_ids: [String],
){
  fileIDsFromList (          
      study_participant_ids: $study_participant_ids,
  ) 
}
  `;

export const GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL = gql`
query search (          
  $sample_ids: [String],
){
  fileIDsFromList (          
    sample_ids: $sample_ids,
  ) 
}
  `;

export const GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL = gql`
query search (          
  $file_names: [String] 
){
  fileIDsFromList (          
      file_names: $file_names
  ) 
}
  `;

export const GET_ALL_FILEIDS_PROTOCOLSTAB_FOR_SELECT_ALL = gql`
query search (          
  $protocol_pk_ids: [String],
){
  fileIDsFromList (          
      protocol_pk_ids: $protocol_pk_ids,
  ) 
}
  `;

// --------------- GraphQL query - Add All to Cart Button --------------
/*
export const GET_ALL_FILEIDS_FROM_CASESTAB_FOR_ADD_ALL_CART = gql`
query subjectOverview(
  $subject_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $genders:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
subjectOverview(
      subject_ids: $subject_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      genders:$genders,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  
  ) {
  files
}
}
    `;

export const GET_ALL_FILEIDS_FROM_SAMPLETAB_FOR_ADD_ALL_CART = gql`
query sampleOverview(
  $subject_ids: [String],
  $sample_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $genders:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  sampleOverview(
      subject_ids: $subject_ids,
      sample_ids: $sample_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      genders:$genders,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  ){
      files
  }
}

        `;
*/

export const GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART = gql`
query fileOverview(
  $subject_ids: [String],
  $sample_ids: [String],
  $accesses:[String],
  $acl:[String],
  $experimental_strategies:[String],
  $file_types:[String],
  $sex:[String],
  $image_modality:[String],
  $instrument_models:[String],
  $is_tumor:[String],
  $library_layouts:[String],
  $library_selections:[String],
  $library_source_materials:[String],
  $library_source_molecules:[String],
  $library_strategies:[String],
  $number_of_study_participants:[Float],
  $number_of_study_samples:[Float],
  $phs_accession:[String],
  $platforms:[String],
  $primary_diagnoses:[String],
  $reference_genome_assemblies:[String],
  $sample_types:[String],
  $site:[String],
  $studies:[String],
  $study_data_types:[String],
  $analytical_fractions:[String],
  $instrument_makes:[String],
  $proteomic_design_descriptions:[String],
  $organ_or_tissue:[String],
  $tissue_fixative:[String],
  $imaging_assay_type:[String],
  $is_supplementary_file: [String],
  $protocol_names: [String],
  $protocol_types: [String],
  $dois: [String],
  $publication_titles: [String],
  $publication_statuses: [String],
  $pub_ids: [String],
  $nanomaterial_entities: [String],
  $functionalizing_entities: [String],
  $characterization_types: [String],
  $characterization_names: [String],

  $order_by: String,
  $sort_direction: String,
  $first: Int,
  $offset: Int
){
  fileOverview(
      subject_ids: $subject_ids,
      sample_ids: $sample_ids,
      accesses:$accesses,
      acl:$acl,
      experimental_strategies:$experimental_strategies,
      file_types:$file_types,
      sex:$sex,
      image_modality:$image_modality,
      instrument_models:$instrument_models,
      is_tumor:$is_tumor,
      library_layouts:$library_layouts,
      library_selections:$library_selections,
      library_source_materials:$library_source_materials,
      library_source_molecules:$library_source_molecules,
      library_strategies:$library_strategies,
      number_of_study_participants:$number_of_study_participants,
      number_of_study_samples:$number_of_study_samples,
      phs_accession:$phs_accession,
      platforms:$platforms,
      primary_diagnoses:$primary_diagnoses,
      reference_genome_assemblies:$reference_genome_assemblies,
      sample_types:$sample_types,
      site:$site,
      studies:$studies,
      study_data_types:$study_data_types,
      analytical_fractions:$analytical_fractions,
      instrument_makes:$instrument_makes,
      proteomic_design_descriptions:$proteomic_design_descriptions,
      organ_or_tissue:$organ_or_tissue,
      tissue_fixative:$tissue_fixative,
      imaging_assay_type:$imaging_assay_type,
      is_supplementary_file: $is_supplementary_file,
      protocol_names: $protocol_names,
      protocol_types: $protocol_types,
      dois: $dois,
      publication_titles: $publication_titles,
      publication_statuses: $publication_statuses,
      pub_ids: $pub_ids,
      nanomaterial_entities: $nanomaterial_entities,
      functionalizing_entities: $functionalizing_entities,
      characterization_types: $characterization_types,
      characterization_names: $characterization_names,

      order_by:$order_by,
      sort_direction:$sort_direction,
      first:$first,
      offset:$offset
  ){
      file_id
  }
}

            `;

// --------------- Tabs Table configuration --------------
export const tabContainers = [
  {
    name: 'Participants',
    dataField: 'dataCase',
    api: GET_CASES_OVERVIEW_QUERY,
    paginationAPIField: 'subjectOverview',
    count: 'numberOfSubjects',
    dataKey: 'study_participant_id',
    defaultSortField: 'subject_id',
    defaultSortDirection: 'asc',
    buttonText: 'Add Selected Files',
    tableID: 'case_tab_table',
    tooltipConfig: {
      title: 'This tab displays detailed information about study participants. Use it to review participant counts and key attributes.',
      arrow: true,
      placement: "top",
    },
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'View Columns',
      },
      download: {
        downloadCsv: 'Download Table Content As CSV',
        downloadFileName: 'GC_participant_Download',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'Unique identifier for each participant.',
      },
      {
        dataField: 'study_acronym',
        header: 'Study Name',
        display: true,
        tooltipText: 'Name of the study to which the participant belongs.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'phs_accession',
        header: 'Accession',
        linkAttr: {
          rootPath: '/study',
          pathParams: ['phs_accession'],
          // i.e: link: '/study/{phs_accession}',
        },
        display: true,
        tooltipText: 'Unique study accession.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'sex',
        header: 'Sex',
        display: true,
        tooltipText: 'Sex of the participant.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'samples',
        header: 'Samples',
        display: true,
        tooltipText: 'Number of samples for the participant.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'race',
        header: 'Race',
        display: false,
        tooltipText: 'Race of the participant.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'ethnicity',
        header: 'Ethnicity',
        display: false,
        tooltipText: 'Ethnicity of the participant.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'primary_diagnosis',
        header: 'Primary Diagnosis',
        display: false,
        tooltipText: 'Primary diagnosis associated with the participant.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
    ],
    id: 'case_tab',
    tableID: 'case_tab_table',
    tableDownloadCSV: customCasesTabDownloadCSV,
    tabIndex: '0',
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'study_participant_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'file_id'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_CASESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Samples',
    dataField: 'dataSample',
    api: GET_SAMPLES_OVERVIEW_QUERY,
    count: 'numberOfSamples',
    paginationAPIField: 'sampleOverview',
    dataKey: 'sample_id',
    defaultSortField: 'sample_id',
    defaultSortDirection: 'asc',
    tableID: 'sample_tab_table',
    tooltipConfig: {
      title: 'This tab shows details about the samples collected in the study. Review sample counts and characteristics here.',
      arrow: true,
      placement: "top",
    },
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'View Columns',
      },
      download: {
        downloadCsv: 'Download Table Content As CSV',
        downloadFileName: 'GC_sample_Download',
      },
    },
    saveButtonDefaultStyle: {
      color: '#fff',
      backgroundColor: '#00AEEF',
      opacity: '1',
      border: '0px',
      cursor: 'pointer',
    },
    DeactiveSaveButtonDefaultStyle: {
      opacity: '0.3',
      cursor: 'auto',
    },
    ActiveSaveButtonDefaultStyle: {
      cursor: 'pointer',
      opacity: 'unset',
      border: 'unset',
    },

    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'study_acronym',
        header: 'Study Name',
        tooltipText: 'Name of the study to which the sample belongs.',
        display: true,
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'phs_accession',
        header: 'Accession',
        linkAttr: {
          rootPath: '/study',
          pathParams: ['phs_accession'],
        },
        display: true,
        tooltipText: 'Unique accession number for the sample\'s data.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'sample_id',
        header: 'Sample ID',
        display: true,
        tooltipText: 'Unique identifier for each sample.',
      },
      {
        dataField: 'sample_name',
        header: 'Sample Name',
        display: true,
        tooltipText: 'Name or label of referenced sample.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'organization_name',
        header: 'Organization Name',
        display: true,
        tooltipText: 'Organization where the sample was collected.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        display: false,
        tooltipText: 'ID of the participant from whom the sample was collected.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'files',
        header: 'Files',
        display: false,
        tooltipText: 'File unique ID associated with the participant and sample.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'sample_type',
        header: 'Sample Type',
        display: false,
        tooltipText: 'Tissue type of this sample.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'sample_tumor_status',
        header: 'Sample Tumor Status',
        display: false,
        tooltipText: 'Indicates whether the sample is from a tumor or normal tissue.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'organ_or_tissue',
        header: 'Organ or Tissue',
        display: false,
        tooltipText: 'Organ or tissue site from which the sample was obtained.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
    ],
    id: 'sample_tab',
    tableID: 'sample_tab_table',
    tabIndex: '1',
    tableDownloadCSV: customSamplesTabDownloadCSV,
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'sample_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'file_id'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Files',
    dataField: 'dataFile',
    api: GET_FILES_OVERVIEW_QUERY,
    paginationAPIField: 'fileOverview',
    defaultSortField: 'file_name',
    defaultSortDirection: 'asc',
    count: 'numberOfFiles',
    dataKey: 'file_id',
    tableID: 'file_tab_table',
    tooltipConfig: {
      title: 'This tab provides information about files associated with the study. Review file details and their connections to other data.',
      arrow: true,
      placement: "top",
    },
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'View Columns',
      },
      download: {
        downloadCsv: 'Download Table Content As CSV',
        downloadFileName: 'GC_file_Download',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'study_acronym',
        header: 'Study Name',
        display: true,
        tooltipText: 'Name of the study to which the files belong.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'phs_accession',
        header: 'Accession',
        cellType: cellTypes.CUSTOM_ELEM,
        linkAttr: {
          rootPath: '/study',
          pathParams: ['phs_accession'],
          // i.e: link: '/study/{phs_accession}',
        },
        display: true,
        tooltipText: 'Unique accession number for the file\'s data.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'file_name',
        header: 'File Name',
        display: true,
        tooltipText: 'Names of the files associated with the study.',
      },
      {
        dataField: 'file_id',
        header: 'File ID',
        display: true,
        tooltipText: 'sort',
      },
      {
        dataField: 'file_type',
        header: 'File Type',
        sort: 'asc',
        display: true,
        tooltipText: 'Format of the file (e.g., BAM, FASTQ).',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'sample_id',
        header: 'Sample ID',
        display: true,
        tooltipText: 'ID of the sample linked to the file.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        display: false,
        tooltipText: 'ID of the participant linked to the file.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      // {
      //   dataField: 'acl', // This need to left empty if no data need to be displayed before file download icon
      //   header: 'Access',
      //   display: true,
      //   cellType: cellTypes.CUSTOM_ELEM,
      //   downloadDocument: true, // To indicate that column is document donwload
      //   documentDownloadProps: {
      //     // Max file size needs to bin Bytes to seperate two support file preview and download
      //     maxFileSize: 315,
      //     // Tool top text for Unauthenticated users
      //     toolTipTextUnauthenticated: 'Controlled access file',
      //     // Tool top text for file download
      //     toolTipTextFileDownload: 'Download a copy of this file',
      //     // Tool top text for file preview
      //     toolTipTextFilePreview: 'Because of its size and/or format, this file is unavailable for download and must be accessed via the My Files workflow',
      //     // datafield where file file column exists in the table
      //     fileSizeColumn: 'file_size',
      //     // datafield where file file id exists in the table which is used to get file location
      //     fileLocationColumn: 'file_id',
      //     // datafield where file format exists in the table
      //     fileFormatColumn: 'file_format',
      //     // datafield where file case id exists in the table which is used to get file information
      //     caseIdColumn: 'subject_id',
      //     // Unauthenticated lock icon
      //     iconUnauthenticated: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/Access_Lock.svg',
      //     // file download icon
      //     iconFileDownload: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/DocumentDownloadPDF.svg',
      //     // file preview icon
      //     iconFilePreview: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/DocumentDownloadCloud.svg',
      //     // file viewer icon JBrowse
      //     iconFileViewer: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/DocumentDownloadBAM.svg',
      //   },
      //   tooltipText: 'sort',
      //   role: cellTypes.DISPLAY,
      // },
      {
        dataField: 'file_size',
        header: 'File Size',
        display: false,
        tooltipText: 'Size of the file in bytes.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'study_data_type',
        header: 'Study Data Type',
        display: false,
        tooltipText: 'Type of data contained in the file (e.g., genomic, imagining).',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'library_strategy',
        header: 'Library Strategy',
        display: false,
        tooltipText: 'Experimental library preparation strategy used for the file.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'supplementary_file_names',
        header: 'Supplementary Files',
        display: false,
        tooltipText: 'Supplemental files contain additional data and references supporting the study.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
      {
        dataField: 'image_modality',
        header: 'Image Modality',
        display: false,
        tooltipText: 'Modality used if the file contains imaging data (e.g., MRI, CT).',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'file_tab',
    tableID: 'file_tab_table',
    selectableRows: true,
    tableDownloadCSV: customFilesTabDownloadCSV,
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'file_names',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'file_id'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    //addSelectedFilesQuery: GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Protocols',
    dataField: 'dataProtocol',
    api: GET_PROTOCOLS_OVERVIEW_QUERY,
    paginationAPIField: 'protocolOverview',
    defaultSortField: 'doi',
    defaultSortDirection: 'desc',
    count: 'numberOfProtocols',
    dataKey: 'protocol_pk_id',
    tableID: 'protocol_tab_table',
    tooltipConfig: {
      title: 'This tab provides information about protocols associated with caNano data. Review protocol details and their connections to DOIs.',
      arrow: true,
      placement: "top",
    },
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: 'View Columns',
      },
      download: {
        downloadCsv: 'Download Table Content As CSV',
        downloadFileName: 'GC_protocol_Download',
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'protocol_name',
        header: 'Protocol Name',
        display: true,
        tooltipText: 'Name assigned to protocol associated with the study.',
      },
      {
        dataField: 'protocol_type',
        header: 'Protocol Type',
        display: true,
        tooltipText: 'Type of protocol associated with the study.',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'doi',
        header: 'DOI',
        display: true,
        tooltipText: 'Unique digital object identifier associated with the study.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        externalLinkAttr: {
          urlField: 'doi_url',
        },
      },
      {
        dataField: 'file_names',
        header: 'File Name',
        display: true,
        tooltipText: 'Name of file associated with the study.',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
      },
    ],
    id: 'protocol_tab',
    selectableRows: true,
    downloadFileName: 'GC_protocol_Download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'protocol_pk_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'file_id'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_PROTOCOLSTAB_FOR_SELECT_ALL,
  },
];


