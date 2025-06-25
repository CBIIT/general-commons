![General Commons logo](GeneralCommons-Desktop-Color-Logo.svg)
# General Commons API
last updated: 27 June 2025  
schema version: 3.1.0  
data model version: 8.0.1

## Introduction
The General Commons GraphQL API includes a corresponding query for each of the data types in the General Commons data model. 
This document will refer to this set of queries as the **Data Type Queries**.
The Data Type Queries allow users to access untransformed data directly from the General Commons Memgraph database. 
The other queries accessible through the General Commons GraphQL API involve data transformations and are designed
to retrieve data for the General Commons user interface, they will not be included in this document. 

## General Commons GraphQL API
The General Commons GraphQL API can be accessed at this URL: https://general.datacommons.cancer.gov/v1/graphql/. 
A GET request to this endpoint will return a GraphQL schema for the Data Type Queries. 
GraphQL requests can be executed by sending a POST request to this endpoint.

## Pagination
Pagination is required for the Data Type Queries. There are two pagination variables: **offset** and **first**.  
The **offset** variable controls how many data records are skipped before starting the result set.
If the **offset** variable is not included in the request then it will default to 0.  
The **first** variable controls how many data records will be returned, starting from the offset with a maximum of 10000. 
If the **first** is not included in the request then it will default to 10.

## Node Count Queries

The Node Count Queries return the total number of nodes for each data type in the General Commons database. With the exception of the `Program`, `Study`, and `Version` count queries, these require a `phs_accession` parameter to specify the associated study.

---

### Programs Count Query
Description: Returns the total number of Program nodes
Query Name: `programsCount`  
Return Type: `Int`  
Parameters: `None`

---

### Studies Count Query
Description: Returns the total number of Study nodes 
Query Name: `studiesCount`  
Return Type: `Int`  
Parameters: `None`

---

### Participants Count Query
Description: Returns the total number of Participant nodes for a given study  
Query Name: `participantsCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Samples Count Query
Description: Returns the total number of Sample nodes for a given study  
Query Name: `samplesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Files Count Query
Description: Returns the total number of File nodes for a given study  
Query Name: `filesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Diagnoses Count Query
Description: Returns the total number of Diagnosis nodes for a given study  
Query Name: `diagnosesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Treatments Count Query
Description: Returns the total number of Treatment nodes for a given study  
Query Name: `treatmentsCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Images Count Query
Description: Returns the total number of Image nodes for a given study  
Query Name: `imagesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Genomic Info Count Query
Description: Returns the total number of Genomic Info nodes for a given study  
Query Name: `genomicInfoCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Proteomics Count Query
Description: Returns the total number of Proteomic nodes for a given study  
Query Name: `proteomicsCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### PDX Count Query
Description: Returns the total number of PDX nodes for a given study  
Query Name: `pdxCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Multiplex Microscopies Count Query
Description: Returns the total number of Multiplex Microscopies nodes for a given study  
Query Name: `multiplexMicroscopiesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Non-DICOMCT Images Count Query
Description: Returns the total number of Non-DICOMCT Images nodes for a given study  
Query Name: `nonDICOMCTimagesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Non-DICOMMR Images Count Query
Description: Returns the total number of Non-DICOMMR Images nodes for a given study  
Query Name: `nonDICOMMRimagesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Non-DICOMPET Images Count Query
Description: Returns the total number of Non-DICOMPET Images nodes for a given study  
Query Name: `nonDICOMPETimagesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Non-DICOM Pathology Images Count Query
Description: Returns the total number of Non-DICOM Pathology Images nodes for a given study  
Query Name: `nonDICOMpathologyImagesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Non-DICOM Radiology All-Modalities Count Query
Description: Returns the total number of Non-DICOM Radiology All-Modalities nodes for a given study  
Query Name: `nonDICOMradiologyAllModalitiesCount`  
Return Type: `Int`  
Parameters:

| Name         | Type   | Required | Description                                   |
|--------------|--------|----------|-----------------------------------------------|
| phs_accession| String | True     | The phs_accession of the associated Study     |

---

### Versions Count Query
Description: Returns the total number of Version nodes  
Query Name: `versionsCount`  
Return Type: `Int`  
Parameters: `None`

## Data Type Queries
Please refer to the GraphQL schema for a list of properties that can be included in these requests.

---


### Programs Query ###
Description: Returns a list of program data records  
Query Name: ```programs```  
Data Type: ```Program```  
Parameters:  

| Name          | Type     | Required | Description                                 |
|---------------|----------|----------|---------------------------------------------|
| program_names | [String] | False    | Filters the results set by the program_name |
| first         | Int      | False    | Controls the results pagination size        |
| offset        | Int      | False    | Controls the results pagination offset      |

---

### Studies Query
Description: Returns a list of study data records  
Query Name: ```studies```  
Data Type: ```Study```  
Parameters:

| Name           | Type     | Required | Description                            |
|----------------|----------|----------|----------------------------------------|
| phs_accessions | [String] | False    | Filters the results by phs_accession   |
| study_names    | [String] | False    | Filters the results by study_name      |
| study_acronyms | [String] | False    | Filters the results by study_acronym   |
| first          | Int      | False    | Controls the results pagination size   |
| offset         | Int      | False    | Controls the results pagination offset |

---

### Participants Query
Description: Returns a list of participant data records   
Query Name: ```participants```  
Data Type: ```Participant```  
Parameters:

| Name            | Type     | Required | Description                                                  |
|-----------------|----------|----------|--------------------------------------------------------------|
| participant_ids | [String] | False    | Filters the results by participant_id                        |
| phs_accession   | String   | True     | Filters the results by phs_accession of the associated Study |
| first           | Int      | False    | Controls the results pagination size                         |
| offset          | Int      | False    | Controls the results pagination offset                       |

---

### Diagnoses Query
Description: Returns a list of diagnosis data records  
Query Name: ```diagnoses```  
Data Type: ```Diagnosis```  
Parameters:

| Name            | Type     | Required | Description                                                         |
|-----------------|----------|----------|---------------------------------------------------------------------|
| diagnosis_ids   | [String] | False    | Filters the results by diagnosis_id                                 |
| phs_accession   | String   | True     | Filters the results by phs_accession of the associated Study        |
| participant_ids | [String] | False    | Filters the results by participant_id of the associated Participant |
| first           | Int      | False    | Controls the results pagination size                                |
| offset          | Int      | False    | Controls the results pagination offset                              |

---

### Treatments Query
Description: Returns a list of treatment data records   
Query Name: ```treatments```  
Data Type: ```Treatment```  
Parameters:

| Name            | Type     | Required | Description                                                         |
|-----------------|----------|----------|---------------------------------------------------------------------|
| treatment_ids   | [String] | False    | Filters the results by treatment_id                                 |
| phs_accession   | String   | True     | Filters the results by phs_accession of the associated Study        |
| participant_ids | [String] | False    | Filters the results by participant_id of the associated Participant |
| first           | Int      | False    | Controls the results pagination size                                |
| offset          | Int      | False    | Controls the results pagination offset                              |

---

### Samples Query
Description: Returns a list of sample data records  
Query Name: ```samples```  
Data Type: ```Sample```  
Parameters:

| Name            | Type     | Required | Description                                                         |
|-----------------|----------|----------|---------------------------------------------------------------------|
| sample_ids      | [String] | False    | Filters the results by sample_id                                    |
| phs_accession   | String   | True     | Filters the results by phs_accession of the associated Study        |
| participant_ids | [String] | False    | Filters the results by participant_id of the associated Participant |
| first           | Int      | False    | Controls the results pagination size                                |
| offset          | Int      | False    | Controls the results pagination offset                              |

---

### Files Query
Description: Returns a list of file data records   
Query Name: ```files```  
Data Type: ```File```  
Parameters:

| Name                 | Type     | Required | Description                                                                                          |
|----------------------|----------|----------|------------------------------------------------------------------------------------------------------|
| file_ids             | [String] | False    | Filters the results by file_id                                                                       |
| file_names           | [String] | False    | Filters the results by file_name                                                                     |
| file_types           | [String] | False    | Filters the results by file_type                                                                     |
| released_range_start | String   | False    | Filters the results by files released on or after the provided date (accepted format is YYYY-MM-DD)  |
| released_range_end   | String   | False    | Filters the results by files released on or before the provided date (accepted format is YYYY-MM-DD) |
| phs_accession        | String   | True     | Filters the results by phs_accession of the associated Study                                         |
| participant_ids      | [String] | False    | Filters the results by participant_id of the associated Participants                                 |
| first                | Int      | False    | Controls the results pagination size                                                                 |
| offset               | Int      | False    | Controls the results pagination offset                                                               |

---

### Genomic Info Query
Description: Returns a list of genomic info data records   
Query Name: ```genomic_info```  
Data Type: ```Genomic_Info```  
Parameters:

| Name             | Type     | Required | Description                                                  |
|------------------|----------|----------|--------------------------------------------------------------|
| genomic_info_ids | [String] | False    | Filters the results by genomic_info_id                       |
| phs_accession    | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids         | [String] | False    | Filters the results by file_id of the associated File        |
| first            | Int      | False    | Controls the results pagination size                         |
| offset           | Int      | False    | Controls the results pagination offset                       |

---

### Images Query
Description: Returns a list of image data records   
Query Name: ```images```  
Data Type: ```Image```  
Parameters:

| Name           | Type     | Required | Description                                                  |
|----------------|----------|----------|--------------------------------------------------------------|
| study_link_ids | [String] | False    | Filters the results by study_link_id                         |
| phs_accession  | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids       | [String] | False    | Filters the results by file_id of the associated File        |
| first          | Int      | False    | Controls the results pagination size                         |
| offset         | Int      | False    | Controls the results pagination offset                       |

---

### Multiplex Microscopies Query
Description: Returns a list of multiplex microscopy data records  
Query Name: ```multiplex_microscopies```  
Data Type: ```MultiplexMicroscopy```  
Parameters:

| Name                     | Type     | Required | Description                                                  |
|--------------------------|----------|----------|--------------------------------------------------------------|
| multiplex_microscopy_ids | [String] | False    | Filters the results by multiplex_microscopy_id               |    
| phs_accession            | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids                 | [String] | False    | Filters the results by file_id of the associated File        ||
| first                    | Int      | False    | Controls the results pagination size                         |
| offset                   | Int      | False    | Controls the results pagination offset                       |

---

### Non-DICOMT Images Query
Description: Returns a list of non-DICOMT image data records  
Query Name: ```non_dicomct_images```  
Data Type: ```NonDICOMCTimages```  
Parameters:

| Name                   | Type     | Required | Description                                                  |
|------------------------|----------|----------|--------------------------------------------------------------|
| non_dicomct_images_ids | [String] | False    | Filters the results by non_dicomct_images_id                 |    
| phs_accession          | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids               | [String] | False    | Filters the results by file_id of the associated File        |
| first                  | Int      | False    | Controls the results pagination size                         |
| offset                 | Int      | False    | Controls the results pagination offset                       |

---

### Non-DICOMMR Images Query
Description: Returns a list of non-DICOMMR image data records  
Query Name: ```non_dicommr_images```  
Data Type: ```NonDICOMMRimages```  
Parameters:

| Name                   | Type     | Required | Description                                                  |
|------------------------|----------|----------|--------------------------------------------------------------|
| non_dicommr_images_ids | [String] | False    | Filters the results by non_dicommr_images_id                 |    
| phs_accession          | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids               | [String] | False    | Filters the results by file_id of the associated File        |
| first                  | Int      | False    | Controls the results pagination size                         |
| offset                 | Int      | False    | Controls the results pagination offset                       |

---

### Non-DICOM Pathology Images Query
Description: Returns a list of non-DICOM pathology images data records  
Query Name: ```non_dicom_pathology_images```  
Data Type: ```NonDICOMpathologyImages```  
Parameters:

| Name                           | Type     | Required | Description                                                  |
|--------------------------------|----------|----------|--------------------------------------------------------------|
| non_dicom_pathology_images_ids | [String] | False    | Filters the results by non_dicom_pathology_images_id         |    
| phs_accession                  | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids                       | [String] | False    | Filters the results by file_id of the associated File        |
| first                          | Int      | False    | Controls the results pagination size                         |
| offset                         | Int      | False    | Controls the results pagination offset                       |

---

### Non-DICOMPET Images Query
Description: Returns a list of non-DICOMPET images data records  
Query Name: ```non_dicompet_images```  
Data Type: ```NonDICOMPETimages```  
Parameters:

| Name                    | Type     | Required | Description                                                  |
|-------------------------|----------|----------|--------------------------------------------------------------|
| non_dicompet_images_ids | [String] | False    | Filters the results by non_dicompet_images_id                |    
| phs_accession           | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids                | [String] | False    | Filters the results by file_id of the associated File        |
| first                   | Int      | False    | Controls the results pagination size                         |
| offset                  | Int      | False    | Controls the results pagination offset                       |

---

### Non-DICOM Radiology All-Modalities Query
Description: Returns a list of non-DICOM radiology all-modalities data records  
Query Name: ```non_dicom_radiology_all_modalities```  
Data Type: ```NonDICOMradiologyAllModalities```  
Parameters:

| Name                                   | Type     | Required | Description                                                  |
|----------------------------------------|----------|----------|--------------------------------------------------------------|
| non_dicom_radiology_all_modalities_ids | [String] | False    | Filters the results by non_dicom_radiology_all_modalities_id |    
| phs_accession                          | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids                               | [String] | False    | Filters the results by file_id of the associated File        |
| first                                  | Int      | False    | Controls the results pagination size                         |
| offset                                 | Int      | False    | Controls the results pagination offset                       |

---

### Proteomics Query
Description: Returns a list of proteomic data records  
Query Name: ```proteomics```  
Data Type: ```Proteomic```  
Parameters:

| Name               | Type     | Required | Description                                                  |
|--------------------|----------|----------|--------------------------------------------------------------|
| proteomic_info_ids | [String] | False    | Filters the results by proteomic_info_id                     |    
| phs_accession      | String   | True     | Filters the results by phs_accession of the associated Study |
| file_ids           | [String] | False    | Filters the results by file_id of the associated File        |
| first              | Int      | False    | Controls the results pagination size                         |
| offset             | Int      | False    | Controls the results pagination offset                       |

---

### PDX Query
Description: Returns a list of PDX data records  
Query Name: ```pdx```  
Data Type: ```PDX```  
Parameters:

| Name          | Type     | Required | Description                                                  |
|---------------|----------|----------|--------------------------------------------------------------|
| pdx_ids       | [String] | False    | Filters the results by pdx_id                                |    
| phs_accession | String   | True     | Filters the results by phs_accession of the associated Study |
| sample_ids    | [String] | False    | Filters the results by sample_id of the associated Sample    |
| first         | Int      | False    | Controls the results pagination size                         |
| offset        | Int      | False    | Controls the results pagination offset                       |


## Version Queries
The Version Queries can be used to retrieve version information about the data, the data model, and the GraphQL API.

---

### Data Version Query
Description: Returns the version information for the General Commons data  
Query Name: ```version```   
Data Type: ```Version```  

---

### Schema Version Query
Description: Returns the General Commons GraphQL API schema version  
Query Name: ```schemaVersion```   
Data Type: ```String```  

---

### Data Model Version Query
Description: Returns the General Commons data model version used by the GraphQL API schema  
Query Name: ```schemaModelVersion```   
Data Type: ```String```  


 



