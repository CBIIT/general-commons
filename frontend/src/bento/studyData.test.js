import { cellTypes } from "@bento-core/table";
import {
  customTypes,
  studyListingIcon,
  externalLinkIcon,
  table,
  GET_STUDIES_DATA_QUERY,
} from "./studyData";

const getQueryFieldNames = (document) => {
  const queryDef = document.definitions.find(
    (definition) => definition.operation === "query",
  );
  const studyListField = queryDef.selectionSet.selections.find(
    (selection) => selection.name.value === "studyList",
  );

  return studyListField.selectionSet.selections.map(
    (selection) => selection.name.value,
  );
};

describe("studyData icons", () => {
  it("should define a study listing icon with src and alt text", () => {
    expect(studyListingIcon.src).toBeTruthy();
    expect(studyListingIcon.alt).toBe("GC Study logo");
  });

  it("should define an external link icon with src and alt text", () => {
    expect(externalLinkIcon.src).toBeTruthy();
    expect(externalLinkIcon.alt).toBe("External link icon");
  });
});

describe("studyData custom types", () => {
  it("should export dashboard and number-format custom cell types", () => {
    expect(customTypes.DASHBOARD_LINK_FROM_LIST).toBe("dashboardLinkFromList");
    expect(customTypes.NUMBER_FORMAT_VIEW).toBe("numberFormatView");
  });
});

describe("studyData table configuration", () => {
  it("should bind the studies table to the studyList query result", () => {
    expect(table.name).toBe("studies");
    expect(table.title).toBe("Studies");
    expect(table.display).toBe(true);
    expect(table.dataField).toBe("studyList");
    expect(table.dataKey).toBe("study_name");
    expect(table.tableID).toBe("studies_table");
    expect(table.defaultSortField).toBe("study_name");
    expect(table.defaultSortDirection).toBe("asc");
    expect(table.selectableRows).toBe(false);
  });

  it("should stay within the 10-column table limit", () => {
    expect(table.columns.length).toBeGreaterThan(0);
    expect(table.columns.length).toBeLessThanOrEqual(10);
  });

  it("should use a default sort field that exists in the columns", () => {
    const columnFields = table.columns.map((column) => column.dataField);
    expect(columnFields).toContain(table.defaultSortField);
  });

  it("should display a Program Name column from program_name", () => {
    const programColumn = table.columns.find(
      (column) => column.dataField === "program_name",
    );

    expect(programColumn).toBeDefined();
    expect(programColumn.header).toBe("Program Name");
    expect(programColumn.tooltipText).toBe("Sort by Program Name");
    expect(programColumn.display).toBe(true);
  });

  it("should configure study, version, and count columns", () => {
    const byField = Object.fromEntries(
      table.columns.map((column) => [column.dataField, column]),
    );

    expect(byField.phs_accession.cellType).toBe(cellTypes.LINK);
    expect(byField.phs_accession.linkAttr).toEqual({
      rootPath: "/study",
      pathParams: ["phs_accession"],
    });

    expect(byField.study_version.cellType).toBe(cellTypes.CUSTOM_ELEM);
    expect(byField.study_version.customType).toBe(
      customTypes.DASHBOARD_LINK_FROM_LIST,
    );

    expect(byField.numberOfSubjects.cellType).toBe(cellTypes.CUSTOM_ELEM);
    expect(byField.numberOfFiles.cellType).toBe(cellTypes.CUSTOM_ELEM);
  });
});

describe("GET_STUDIES_DATA_QUERY", () => {
  it("should query studyList", () => {
    const queryDef = GET_STUDIES_DATA_QUERY.definitions.find(
      (definition) => definition.operation === "query",
    );
    const fieldNames = queryDef.selectionSet.selections.map(
      (selection) => selection.name.value,
    );

    expect(fieldNames).toEqual(["studyList"]);
  });

  it("should request the fields shown in the studies table, including program_name", () => {
    const queryFields = getQueryFieldNames(GET_STUDIES_DATA_QUERY);
    const displayedColumnFields = table.columns
      .filter((column) => column.display)
      .map((column) => column.dataField);

    expect(queryFields).toEqual(
      expect.arrayContaining([
        "study_name",
        "phs_accession",
        "study_version",
        "study_access",
        "numberOfSubjects",
        "numberOfFiles",
        "data_type",
        "program_name",
      ]),
    );
    expect(queryFields).toEqual(expect.arrayContaining(displayedColumnFields));
  });
});
