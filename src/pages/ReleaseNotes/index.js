// import { withStyles } from "@mui/styles";
import {
  withStyles,
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons'; 
import clsx from 'clsx'; 
import React, { useState, useEffect } from 'react';
import jsonLink from '../../bento/releaseNotesData';
import styles from './styles';
import ReleaseNotes from './components/releaseNotes';
import Stats from '../../components/Stats/AllStatsController';
import { Typography } from '../../components/Wrappers/Wrappers';
import usePageTitle from '../../components/Analytics/usePageTitle';

const releaseNotesURL= jsonLink.substring(0, jsonLink.lastIndexOf('/'));
const dataReleaseURL = releaseNotesURL + '/DataReleaseNotes.json';
const softwareReleaseURL = releaseNotesURL + '/SoftwareReleaseNotes.json';

const ReleaseVersions = (props) => {
  usePageTitle("Release Notes");
  const { classes } = props;
  const [dataReleaseJsonData, setDataReleaseJsonData] = useState(null);
  const [softwareReleaseJsonData, setSoftwareReleaseJsonData] = useState(null);
  const [releaseNoteDetails, setReleaseNoteDetails] = useState(null);
  const [releaseNoteType, setReleaseNoteType] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataReleaseData = async () => {
      try {
        const response = await fetch(dataReleaseURL);
        const data = await response.json();
        setDataReleaseJsonData(data);
        setReleaseNoteDetails(data.VERSIONS[0]); // Set initial version details
        setReleaseNoteType('data');
      } catch (error) {
        setError(error);
        console.error('Error fetching Data Release JSON data:', error);
      }
    };

    const fetchSoftwareReleaseData = async () => {
      try {
        const response = await fetch(softwareReleaseURL);
        const data = await response.json();
        setSoftwareReleaseJsonData(data);
      } catch (error) {
        setError(error);
        console.error('Error fetching Software Release JSON data:', error);
      }
    };

    fetchDataReleaseData();
    fetchSoftwareReleaseData();
  }, []); 

  const handleReleaseNoteClick = (row, type) => {
    setReleaseNoteDetails(row);
    setReleaseNoteType(type);
  };

  return (
    <>
      <Stats />
      <div className={classes.container}>
        {dataReleaseJsonData && softwareReleaseJsonData && (
          <>
            <h1>{dataReleaseJsonData.HEADING}</h1>
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
                      {dataReleaseJsonData.VERSIONS.map((row) => (
                        <div key={row.id} onClick={() => handleReleaseNoteClick(row, 'data')} className={expandedSection === 'data' ? classes.visibleRow : classes.hiddenRow}>
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
                      {softwareReleaseJsonData.VERSIONS.map((row) => (
                        <div key={row.id} onClick={() => handleReleaseNoteClick(row, 'software')} className={expandedSection === 'software' ? classes.visibleRow : classes.hiddenRow}>
                          <div className={classes.dataVersion} align="left">
                            <span className={classes.version}>
                              {"Version: " + row.versionNumber}
                            </span>
                          </div> 
                          <div className={classes.softWareDate} align="left">
                            {"(" + row.releaseDate + ")"}
                          </div> 
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <hr className={classes.horizontalLine} />
              </div>
              {releaseNoteDetails && <ReleaseNotes releaseNoteDetails={releaseNoteDetails} releaseNoteType={releaseNoteType}/>}
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
