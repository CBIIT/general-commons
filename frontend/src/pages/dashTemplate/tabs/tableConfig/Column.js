import React from "react";
import { Link, Typography } from "@material-ui/core";
import { cellTypes, headerTypes } from "@bento-core/table";
import { externalLinkIcon } from "../../../../bento/dashboardTabData";
import DocumentDownloadView from "../../../../components/DocumentDownload/DocumentDownloadView";

export const CustomCellView = (props) => {
  const {
    downloadDocument,
    documentDownloadProps,
    displayEmpty,
    dataField,
    label,
    externalLinkAttr,
  } = props;
  if (downloadDocument) {
    return (
      <DocumentDownloadView
        fileSize={props.file_size}
        caseId={props[documentDownloadProps.caseIdColumn]}
        fileFormat={props[documentDownloadProps.fileFormatColumn]}
        fileLocation={props[documentDownloadProps.fileLocationColumn]}
        {...documentDownloadProps}
        {...props}
        requiredACLs={props[dataField]}
      />
    );
  } else if (externalLinkAttr && externalLinkAttr.urlField) {
    const url = props[externalLinkAttr.urlField];
    const displayValue = props[dataField];
    if (url) {
      return (
        <Link href={url} target="_blank" rel="noopener noreferrer">
          <Typography>
            {displayValue}
            <img
              src={externalLinkIcon.src}
              alt={externalLinkIcon.alt}
              style={{
                width: "1em",
                margin: "0px 0px 2px 2px",
                verticalAlign: "sub",
              }}
            />
          </Typography>
        </Link>
      );
    }
    return <Typography>{displayValue || ""}</Typography>;
  } else if (typeof displayEmpty === "boolean") {
    return (
      <Typography>
        {displayEmpty || props[dataField] ? props[dataField] : ""}
      </Typography>
    );
  } else if (Array.isArray(label)) {
    if (props.linkAttr) {
      const { rootPath } = props.linkAttr;
      return (
        <Typography>
          {label.map((item, idx) => {
            return (
              <Link
                key={idx}
                href={`#${rootPath}/`.concat(item)}
                className={cellTypes.LINK}
              >
                <Typography>
                  {item}
                  {idx !== label.length - 1 && ", "}
                </Typography>
              </Link>
            );
          })}
        </Typography>
      );
    }

    if (label.length > 5) {
      return <Typography>{label.slice(0, 5).join(", ") + ", ..."}</Typography>;
    }
    return <Typography>{label.join(", ")}</Typography>;
  }

  // other custom elem
  return <></>;
};

export const CustomHeaderCellView = () => <></>;

/**
 * set column configuration
 * @param {*} columns
 * @returns config columns
 */
export const configColumn = (columns) => {
  /**
   * display columns as configuration
   * set custom cell render for column
   */
  const displayColumns = columns;
  const displayCustomView = [...displayColumns].map((column) => {
    if (column.cellType === cellTypes.CUSTOM_ELEM) {
      return {
        ...column,
        customCellRender: (props) => <CustomCellView {...props} />,
      };
    }
    return column;
  });

  /**
   * custom header view configuration
   */
  const displayCustomHeader = [...displayCustomView].map((column) => {
    if (column.headerType === headerTypes.CUSTOM_ELEM) {
      return {
        ...column,
        customColHeaderRender: (props) => <CustomHeaderCellView {...props} />,
      };
    }
    return column;
  });
  return displayCustomHeader;
};

