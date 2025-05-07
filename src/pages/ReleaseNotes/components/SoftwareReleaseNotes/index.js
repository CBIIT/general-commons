/* eslint-disable react/no-danger */
import React from 'react';
import {
  withStyles,
} from '@material-ui/core';
import { convertTextToAnchors } from '../../components/util';
import styles from './styles';

const ReleaseNotes = (props) => {
  const { classes, releaseNoteDetails } = props;

  const renderList = (list, keyPrefix = '') => {
    return (
      <ul>
        {list.map((item, index) => {
          const itemKey = `${keyPrefix}-item-${index}`;
          if (typeof item === 'string') { // if the item is a string, we will just add it to the list
            return (
              <li key={itemKey}>
                <span className={classes.insideList}>{convertTextToAnchors(item)}</span>
              </li>
            );
          } else if (typeof item === 'object' && Array.isArray(item.list)) { // if the item is an object with a list, we will render it recursively
            return (
              <li key={itemKey}>
                <div>
                  {item.paragraph && (
                    <span>{convertTextToAnchors(item.paragraph)}</span>
                  )}
                  {renderList(item.list, itemKey)}
                </div>
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  };
  
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
                renderList(item.list, `list-${index}`)
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
