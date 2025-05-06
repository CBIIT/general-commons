/* eslint-disable react/no-danger */
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
        {releaseNoteDetails.subHeadings.map((text, index) => (
          <p key={"SoftwareReleaseNotes-SubHeading-"+index} className={classes.subHeading}>
            {text}
          </p>
        ))}
        <div className={classes.infoWrapper}>
          {releaseNoteDetails.content.map((item, index) => (
            <div key={"SoftwareReleaseNotes-ListSection-"+index} className='listSection'>
              {item.paragraph && (
               <p>{convertTextToAnchors(item.paragraph)}</p>
              )}
              {item.list && (
                <ul>
                  {item.list.map((listItem, listItemIndex) => (
                    <li key={"SoftwareReleaseNotes-ListSection-"+index+"-SoftwareReleaseNotes-ListItem-"+listItemIndex}>
                      {typeof listItem === 'string' ? (
                        <span className={classes.insideList}>{convertTextToAnchors(listItem)}</span>
                      ) : (
                        <div>
                          <span>{convertTextToAnchors(item.paragraph)}</span>
                          {Array.isArray(listItem.list) && listItem.list.length > 0 && (
                            <ul>
                              {listItem.list.map((nestedListItem, nestedIndex) => (
                                <li key={"SoftwareReleaseNotes-ListSection-"+index+"-SoftwareReleaseNotes-ListItem-"+listItemIndex+"-SoftwareReleaseNotes-NestedItem-"+nestedIndex}>
                                 <span className={classes.insideList}>{convertTextToAnchors(nestedListItem)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <hr className={classes.horizontalLine} />
    </div>
  );
};

export default withStyles(styles)(ReleaseNotes);
