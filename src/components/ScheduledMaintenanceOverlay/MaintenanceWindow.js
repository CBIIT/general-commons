import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,

} from '@material-ui/core';
import * as text from './MaintenanceText.json';
import DialogThemeProvider from './MaintenanceThemeConfig';

const MaintenanceWindow = () => {
  const title = text.title;
  const message = text.message.map((item, index) => (
    <p key={`maintenance-text-${index}`}>{item}</p>
  ));

  return (
    <>
      <div>
        <DialogThemeProvider>
          <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
          >
            <DialogTitle >{title}</DialogTitle>
            <DialogContent>
              {message}
            </DialogContent>
          </Dialog>
        </DialogThemeProvider>
      </div>
    </>
  );
};

export default MaintenanceWindow;
