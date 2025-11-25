# Index Specification Context

This document provides context and conventions for working with the `indices.yaml` file. It documents patterns, naming conventions, and best practices for creating and updating index definitions.

## File Structure

The `indices.yaml` file defines Elasticsearch indices that are populated from Neo4j using Cypher queries. Each index definition follows this structure:

```yaml
indices:
  - index_name: "index_name"
    id_field: "unique_identifier_field"
    mapping:
      keyword: [...]
      long: [...]
      boolean: [...]
      search_as_you_type: [...]
    initial_query:
      query: |
        # Cypher query
      page_size: 10000
    update_queries:
      - name: "Query Name"
        query: |
          # Cypher query
        page_size: 10000
```

## Field Naming Conventions

### Field Name Format
- Use **snake_case** for all field names
- Field names should be descriptive and match the source property when possible
- Filter fields: Use descriptive names (e.g., `experimental_strategies`, `sample_types`)
- Sort fields: Append `_sort` suffix to the source field name (e.g., `experimental_strategies_sort`)
- Global search fields: Append `_gs` suffix (e.g., `site_gs`, `study_gs`)

### Field Name Mapping (Old → New)
When migrating from old index formats, use these mappings:
- `study_study_name_filter` → `studies`
- `study_phs_accession_filter` → `phs_accession`
- `study_study_data_type_filter` → `study_data_types`
- `files_experimental_strategy_filter` → `experimental_strategies`
- `files_file_type_filter` → `file_types`
- `demographics_sex_filter` → `sex`
- `samples_sample_tumor_status_filter` → `is_tumor`
- `samples_sample_type_filter` → `sample_types`
- `diagnosis_primary_diagnosis_filter` → `primary_diagnoses`
- `genomic_library_strategy_filter` → `library_strategies`
- `genomic_*_filter` → `*` (remove `genomic_` prefix and `_filter` suffix)
- `imaging_*_filter` → `*` (remove `imaging_` prefix and `_filter` suffix)
- `proteomic_*_filter` → `*` (remove `proteomic_` prefix and `_filter` suffix)

## Mapping Section Organization

### Field Grouping
Fields in the `keyword` mapping should be organized by the query that populates them, with section comments:

```yaml
keyword:
  # initial_query
  - field_name # source.node.property - array/single value
  
  # Query Name
  - field_name # source.node.property - array/single value
  - field_name_sort # derived from field_name - single value
```

### Inline Comment Format
Each field must have an inline comment with:
1. **Source node and property**: `node.property` (e.g., `participant.participant_id`)
2. **Old field name** (if migrated): e.g., `# sample_ids`
3. **Data type**: `- array` or `- single value`

Format: `# source.node.property - old_field_name - array/single value`

Examples:
- `- participant_id # participant.participant_id - single value`
- `- samples # sample.sample_id - sample_ids - array`
- `- experimental_strategies_sort # derived from experimental_strategies - single value`

### Required Information in Comments
- **Source node and property**: Always include `node.property` format
- **Array vs Single Value**: Always specify `- array` or `- single value`
- **Derived fields**: For sort fields, use `# derived from source_field_name - single value`
- **Calculated fields**: For computed fields, use `# calculated - single value`

## Query Patterns

### Single Relationship Pattern (REQUIRED)
**CRITICAL**: All MATCH patterns must use **single relationships only**. Multi-relationship patterns must be split into individual matches with intermediate nodes carried forward via `WITH` clauses.

#### ❌ INCORRECT (Multi-relationship):
```cypher
OPTIONAL MATCH (f:file)-[:of_participant]->(:participant)<-[:of_participant]-(samp:sample)
```

#### ✅ CORRECT (Single relationships):
```cypher
OPTIONAL MATCH (f:file)-[:of_participant]->(p:participant)
WITH DISTINCT samp, f, p
OPTIONAL MATCH (p)<-[:of_participant]-(samp)
```

This pattern reduces graph search space and improves performance on large datasets.

### Initial Query Pattern
```cypher
MATCH (entity:entity_type)
WITH DISTINCT entity, "Not specified in data" AS na
ORDER BY entity.id_field
RETURN DISTINCT
  entity.id_field as id_field,
  COALESCE(entity.property, na) as field_name
SKIP $skip LIMIT $limit
```

### Update Query Pattern
```cypher
MATCH (entity:entity_type)
WITH DISTINCT entity
SKIP $skip LIMIT $limit
OPTIONAL MATCH (entity)-[:relationship]->(related:related_type)
WITH DISTINCT entity, related
# Additional matches...
RETURN DISTINCT
  entity.id_field AS id_field,
  COLLECT(DISTINCT related.property) AS field_name
```

### Sort Field Subquery Pattern
All sort fields must use this pattern:

```cypher
CALL {
  WITH source_array_field
  UNWIND source_array_field AS item
  WITH item
  ORDER BY item
  RETURN reduce(s = '', i IN collect(item) | s + i + '') AS field_name_sort
}
```

This pattern:
1. UNWINDs the array into individual items
2. ORDERs them alphabetically
3. Concatenates them into a single string without delimiters using `reduce`

## Data Type Patterns

### Arrays
Fields are arrays when they use:
- `COLLECT(DISTINCT ...)` in queries
- Multiple values collected from related nodes
- Filter fields that can have multiple values

Examples:
- `samples`, `files`, `experimental_strategies`, `study_data_types`

### Single Values
Fields are single values when they use:
- `COALESCE(property, na)` without COLLECT
- Direct property access
- Calculated values (COUNT, SIZE, etc.)
- Sort fields (concatenated strings)

Examples:
- `participant_id`, `race`, `sex`, `study_participant_id`
- All `_sort` fields

## Field Validation Checklist

When adding or updating fields, ensure:

- [ ] Field name follows snake_case convention
- [ ] Inline comment includes source `node.property`
- [ ] Inline comment specifies `- array` or `- single value`
- [ ] Field is in the correct mapping section (keyword/long/boolean)
- [ ] Field is grouped under the correct query section comment
- [ ] Query returns the correct data type (array vs single value)
- [ ] All MATCH patterns use single relationships only
- [ ] Sort fields use the standard UNWIND/ORDER BY/reduce pattern
- [ ] Source properties match between mapping comments and queries

## Query Organization

### Query Naming
Update queries should be named descriptively:
- `"Participant Samples"` - for queries about participant samples
- `"File Participants"` - for queries about file participants
- `"File Genomic Info"` - for queries about genomic information from files

### Query Comments
Each query should have comments listing all fields it populates:
```cypher
# Query Name
- name: "Query Name"
  # field1
  # field2
  # field2_sort
  query: |
    ...
```

## Common Patterns

### Study Query Pattern
```cypher
MATCH (s:study)
WITH s 
SKIP $skip LIMIT $limit 
OPTIONAL MATCH (s)<-[:of_study]-(p:participant)
WITH DISTINCT s, p
OPTIONAL MATCH (p)<-[:of_participant]-(samp:sample)
WITH DISTINCT s, COLLECT(DISTINCT samp) AS ss
# Process study data...
UNWIND ss AS samp
RETURN DISTINCT
  samp.id_field AS id_field,
  studies,  # array
  phs_accession,  # array
  accesses,  # array
  ...
```

### File Query Pattern
```cypher
MATCH (entity:entity_type)
WITH DISTINCT entity
SKIP $skip LIMIT $limit
OPTIONAL MATCH (entity)-[:of_participant]->(p:participant)
WITH DISTINCT entity, p
OPTIONAL MATCH (p)<-[:of_participant]-(f:file)
WITH entity.id_field AS id_field, COLLECT(DISTINCT f) AS fs
CALL {
  WITH fs
  UNWIND fs AS f
  # Process file data...
  RETURN COLLECT(DISTINCT f.property) AS field_name
}
# Sort subqueries...
RETURN DISTINCT
  id_field,
  field_name,
  field_name_sort
```

### Diagnosis Query Pattern
```cypher
OPTIONAL MATCH (f)-[:of_participant]->(p:participant)
WITH DISTINCT id_field, COLLECT(DISTINCT p) AS ps
CALL {
  WITH ps, na
  WITH CASE WHEN size(ps)=0 THEN [NULL] ELSE ps END AS ps, na
  UNWIND ps AS p
  OPTIONAL MATCH (p)<-[:of_participant]-(pdiag:diagnosis)
  RETURN 
    COLLECT(DISTINCT pdiag.primary_diagnosis) AS p_primary_diagnosis,
    COLLECT(DISTINCT COALESCE(pdiag.primary_site, na)) AS p_primary_site
}
CALL {
  WITH ps, na
  UNWIND ps AS p
  OPTIONAL MATCH (p)<-[:of_participant]-(samp:sample)
  WITH DISTINCT samp, na
  OPTIONAL MATCH (samp)<-[:of_sample]-(sdiag:diagnosis)
  RETURN 
    COLLECT(DISTINCT sdiag.primary_diagnosis) AS s_primary_diagnosis,
    COLLECT(DISTINCT COALESCE(sdiag.primary_site, na)) AS s_primary_site
}
# Combine and process...
```

## Migration from Old Format

When migrating from `es_indices_cds.yml`:

1. **Identify all fields** in the old index (excluding `search_as_you_type`)
2. **Rename fields** to match new naming conventions
3. **Verify data types**: Check if fields are arrays or single values in the old query
4. **Update queries**: Split into `initial_query` and `update_queries`
5. **Add inline comments**: Include source properties and data types
6. **Organize mapping**: Group fields by query with section comments
7. **Split MATCH patterns**: Ensure all use single relationships
8. **Add sort fields**: Implement using the standard pattern
9. **Validate**: Ensure all fields present, formats match, and source properties match

## Validation Rules

### Field Completeness
- All fields from the old index must be present (or explicitly documented as removed)
- No fields should be missing without documentation

### Format Consistency
- Array fields in old index → Array fields in new index
- Single value fields in old index → Single value fields in new index
- Sort fields must be single value strings

### Source Property Matching
- Source `node.property` in comments must match the actual query
- Derived fields must reference the correct source field
- Calculated fields must be marked as `calculated`

### Query Pattern Compliance
- All MATCH patterns must use single relationships
- Intermediate nodes must be carried forward with `WITH`
- Sort subqueries must follow the standard pattern

## Example: Complete Field Definition

```yaml
keyword:
  # File Genomic Info
  - library_strategies # genomic_info.library_strategy - array
  - library_strategies_sort # derived from library_strategies - single value
```

Corresponding query:
```cypher
# File Genomic Info
- name: "File Genomic Info"
  # library_strategies
  # library_strategies_sort
  query: |
    MATCH (entity:entity_type)
    WITH DISTINCT entity
    SKIP $skip LIMIT $limit
    OPTIONAL MATCH (entity)-[:relationship]->(g:genomic_info)
    WITH entity.id_field AS id_field,
      COLLECT(DISTINCT COALESCE(g.library_strategy, na)) AS library_strategies
    CALL {
      WITH library_strategies
      UNWIND library_strategies AS library_strategy
      WITH library_strategy
      ORDER BY library_strategy
      RETURN reduce(s = '', i IN collect(library_strategy) | s + i + '') AS library_strategies_sort
    }
    RETURN DISTINCT
      id_field,
      library_strategies,
      library_strategies_sort
```

## Notes

- **Page sizes**: Typically 10000 for most queries, 50000 for large collections
- **Null handling**: Always use `"Not specified in data" AS na` and `COALESCE(..., na)`
- **Array handling**: Use `CASE WHEN size(array)=0 THEN [na] ELSE array END` for empty arrays
- **Distinct collections**: Always use `COLLECT(DISTINCT ...)` to avoid duplicates
- **Query optimization**: Start matches from the entity being indexed (e.g., `MATCH (samp:sample)`) rather than traversing from study/file

## Related Files

- `indices.yaml`: Main index definition file
- `es_indices_cds.yml`: Legacy index definitions (reference for migration)

