// import { withStyles } from "@mui/styles";
import {
  Table, TableBody, TableCell, TableHead, TableRow, withStyles,
} from '@material-ui/core';
import { ArrowDropDown, Launch } from '@material-ui/icons'; 
import clsx from 'clsx'; 
import React, { useState, useEffect } from 'react';
import jsonLink from '../../bento/releaseNotesData';
import styles from './styles';
import ReleaseNotes from '../ReleaseNotes';
import Stats from '../../components/Stats/AllStatsController';
import { Typography } from '../../components/Wrappers/Wrappers';
import usePageTitle from '../../components/Analytics/usePageTitle';

const ReleaseVersions = (props) => {
  usePageTitle("Release Notes");
  const { classes } = props;
  const [jsonData, setJsonData] = useState(null);
  const [versionDetails, setVersionDetails] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(jsonLink);
        const data = await response.json();
        setJsonData(data);
        setVersionDetails(data.VERSIONS[0]); // Set initial version details
      } catch (error) {
        setError(error);
        console.error('Error fetching JSON data:', error);
      }
    };

    fetchJsonData();
  }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount

  return (
    <>
      <Stats />
      <div className={classes.container}>
        {jsonData && (
          <>
            <h1>{jsonData.HEADING}</h1>
            <div className={classes.wrapper}>
              <div className={classes.tableWrapper}>
                <div className={classes.tableExternal}>
                  <div className={classes.topBorder}/>
                  <div className={classes.table}>
                    <div className={classes.tableHead} onClick={() => setExpandedSection(expandedSection === 'data' ? null : 'data')}>
                      <span className={clsx(classes.releaseHeading, classes.dataHeading)}>  
                        {"DATA RELEASE NOTES"} 
                        <ArrowDropDown className={clsx(classes.releaseDropdown, expandedSection === 'data' ? classes.upsideDown : classes.rightsideUp)}/> 
                      </span>
                    </div>
                    <div className={classes.dataRows}>
                      {jsonData.VERSIONS.map((row) => (
                        <div key={row.id} onClick={() => setVersionDetails(row)} className={expandedSection === 'data' ? classes.visibleRow : classes.hiddenRow}>
                          <div className={classes.dataVersion} align="left">
                            <span className={classes.version}>
                              {"Version: " + row.versionNumber}
                            </span>
                          </div> 
                          <div className={classes.dataDate} align="left">
                            {"(" + row.releaseDate + ")"}
                          </div> 
                        </div>
                      ))}
                    </div>
                    <div className={clsx(classes.tableHead, classes.softwareBorder)} onClick={() => setExpandedSection(expandedSection === 'software' ? null : 'software')}>
                      <span className={clsx(classes.releaseHeading, classes.softwareHeading)}>  
                        {"SOFTWARE RELEASE NOTES"} 
                        <ArrowDropDown className={clsx(classes.releaseDropdown, expandedSection === 'software' ? classes.upsideDown : classes.rightsideUp)}/> 
                      </span>
                    </div>
                    <div className={classes.softwareRows}>
                      {jsonData.VERSIONS.map((row) => (
                        <div key={row.id} onClick={() => setVersionDetails(row)} className={expandedSection === 'software' ? classes.visibleRow : classes.hiddenRow}>
                          <div className={classes.dataVersion} align="left">
                            <span className={classes.version}>
                              {"Version: " + row.versionNumber}
                            </span>
                          </div> 
                          <div className={classes.dataDate} align="left">
                            {"(" + row.releaseDate + ")"}
                          </div> 
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <hr className={classes.horizontalLine} />
              </div>
              {versionDetails && <ReleaseNotes versionDetails={versionDetails} />}
            </div>
          </>
        )}
        {
          error && (
            <Typography variant="h5" color="error" size="sm">
              {error ? `An error has occurred in loading release notes data: ${error}` : 'Recieved wrong data'}
            </Typography>
          )
        }
      </div>
    </>
  );
};

export default withStyles(styles)(ReleaseVersions);
