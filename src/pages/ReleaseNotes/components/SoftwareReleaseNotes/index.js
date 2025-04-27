/* eslint-disable react/no-danger */
import React from 'react';
import {
  withStyles,
} from '@material-ui/core';
import styles from './styles';

const ReleaseNotes = (props) => {
  const { classes, releaseNoteDetails } = props;

  // Function to convert URLs to anchor tags
  const convertToAnchorTags = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
  };

  return (
    <div className={classes.releaseNotesContainer}>
      <hr className={classes.horizontalLine} />
      <div className={classes.releaseNotesWrapper}>
        <h2 className={classes.heading}>{releaseNoteDetails.heading}</h2>
        <p className={classes.releaseDateInfo}>{`Release Date: ${releaseNoteDetails.releaseDate}`}</p>
        {releaseNoteDetails.subHeadings.map((text, index) => (
          <p key={index} className={classes.subHeading}>
            {text}
          </p>
        ))}
        <div className={classes.infoWrapper}>
          {releaseNoteDetails.content.map((item, index) => (
            <div key={index} className='listSection'>
              {item.paragraph && (
                <p dangerouslySetInnerHTML={{ __html: convertToAnchorTags(item.paragraph) }} />
              )}
              {item.list && (
                <ul>
                  {item.list.map((listItem, listItemIndex) => (
                    <li key={listItemIndex}>
                      {typeof listItem === 'string' ? (
                        <span className={classes.insideList} dangerouslySetInnerHTML={{ __html: convertToAnchorTags(listItem) }} />
                      ) : (
                        <div>
                          <span dangerouslySetInnerHTML={{ __html: convertToAnchorTags(listItem.paragraph) }} />
                          {Array.isArray(listItem.list) && listItem.list.length > 0 && (
                            <ul>
                              {listItem.list.map((nestedListItem, nestedIndex) => (
                                <li key={nestedIndex}>
                                  <span className={classes.insideList} dangerouslySetInnerHTML={{ __html: convertToAnchorTags(nestedListItem) }} />
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
