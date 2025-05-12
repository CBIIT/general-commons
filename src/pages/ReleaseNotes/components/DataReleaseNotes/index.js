
import React from 'react';
import {
  withStyles,
} from '@material-ui/core';
import { convertTextToAnchors } from '../../components/util';
import styles from './styles';

const ReleaseNotes = (props) => {
  const { classes, releaseNoteDetails } = props;

  return (
    <div className={classes.releaseNotesContainer}>
      <hr className={classes.horizontalLine} />
      <div className={classes.releaseNotesWrapper}>
        <h2 className={classes.heading}>{releaseNoteDetails.heading}</h2>
        <p className={classes.releaseDateInfo}>{`Release Date: ${releaseNoteDetails.releaseDate}`}</p>
        <p className={classes.subHeading}>{releaseNoteDetails.subHeading}</p>
        <div className={classes.infoWrapper}>
          {releaseNoteDetails.content.map((item, index) => {
            const listSectionKey = "DataReleaseNotes-ListSection-" + index
            return (
              <div key={listSectionKey}>
                {item.paragraph && <p>{convertTextToAnchors(item.paragraph, listSectionKey)}</p>}
                {item.list && (
                  <ul>
                    {item.list.map((listItem, listItemIndex) => {
                      const itemKey = "DataReleaseNotes-ListSection-" + index+"-DataReleaseNotes-ListItem-" + listItemIndex
                      return (
                        <li key={itemKey}>
                          {convertTextToAnchors(listItem, itemKey)}
                        </li>
                    )})}
                  </ul>              
                )}
              </div>
          )})}
        </div>
      </div>
      <hr className={classes.horizontalLine} />
    </div>
  );
};

export default withStyles(styles)(ReleaseNotes);
