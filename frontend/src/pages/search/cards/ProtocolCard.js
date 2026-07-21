import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { prepareLinks } from "@bento-core/util";
import PropertyItem from "./PropertyItem";
import { encodeSubjectIds } from "./utils";

const CARD_PROPERTIES = [
  {
    label: "Protocol Name",
    dataField: "protocol_name",
  },
  {
    label: "Protocol Type",
    dataField: "protocol_type",
  },
  {
    label: "DOI",
    dataField: "doi",
    link: "{doi_url}",
  },
];

const ProtocolCard = ({ data, classes, index }) => {
  const propertiesWithLinks = prepareLinks(CARD_PROPERTIES, data);

  return (
    <Grid
      item
      container
      className={classes.card}
      id={`global_search_card_${index}`}
    >
      <Grid item xs={1} className={classes.indexContainer}>
        {index + 1}
      </Grid>
      <Grid item xs={11} className={classes.propertyContainer}>
        <div>
          <span className={classes.detailContainerHeader}>PROTOCOL</span>
          <span className={classes.cardTitle}>
            <Link
              to={`/data/${encodeSubjectIds(data.subject_ids_filter)}`}
              className={classes.cardTitle}
            >
              {data.protocol_pk_id}
            </Link>
          </span>
        </div>
        {propertiesWithLinks.map((prop, idx) => (
          <PropertyItem
            key={prop.dataField}
            index={idx}
            label={prop.label}
            value={data[prop.dataField]}
            link={prop.link}
          />
        ))}
      </Grid>
    </Grid>
  );
};

const styles = () => ({
  indexContainer: {
    padding: "18px 0px 18px 18px",
    color: "#747474",
    fontFamily: "Inter",
    fontSize: "13px",
  },
  propertyContainer: {
    padding: "16px 16px 16px 0px",
    borderBottom: "2px solid #E7EEF5",
  },
  cardTitle: {
    color: "#7747FF",
    textDecoration: "none",
    fontSize: "16px",
    fontFamily: "Nunito",
    paddingLeft: "9px",
    verticalAlign: "middle",
  },
  detailContainerHeader: {
    textTransform: "uppercase",
    padding: "2px 8px",
    backgroundColor: "#FFE5C2",
    color: "#000000",
    fontFamily: "Nunito",
    fontSize: "12px",
    fontWeight: "400",
    letterSpacing: "0.9px",
    verticalAlign: "middle",
    borderRadius: "4px",
  },
});

export default withStyles(styles, { withTheme: true })(ProtocolCard);

