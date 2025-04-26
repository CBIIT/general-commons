import React from 'react';
import DataReleaseNotes from './DataReleaseNotes';
import SoftwareReleaseNotes from './SoftwareReleaseNotes';

const ReleaseNotes = ({ releaseNoteDetails, releaseNoteType }) => {
  switch (releaseNoteType) {
    case 'data':
      return <DataReleaseNotes releaseNoteDetails={releaseNoteDetails} />;
    case 'software':
      return <SoftwareReleaseNotes releaseNoteDetails={releaseNoteDetails} />;
    default:
      return null;
  }
};

export default ReleaseNotes;
