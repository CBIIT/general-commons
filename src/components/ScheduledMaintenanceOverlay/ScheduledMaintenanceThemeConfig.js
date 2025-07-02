import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import themes, { overrides } from '../../themes';

export default ({
  children,
}) => {
  const overridesObj = themes.light.overrides;

  const MuiDialog = {
    root: {
      zIndex: "999999 !important",
    },
    container: {
      height: '70%',
    },
    paper: {
      width: '779px',
      height: '341px',
      border: '1px solid #ffffff !important',
      borderRadius: '8px !important',
      backgroundColor: '#245478 !important',
      padding: '0px 20px 0px 20px !important',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };


  const MuiDialogTitle = {
    root: {
      padding: '0px !important',
      '& h2': {
        color: '#ffffff',
        fontSize: '20px !important',
        fontFamily: 'Inter',
        fontWeight: '400',
      },
    },
  };

  const MuiDialogContent = {
    root: {
      paddingBottom: '50px !important',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flexGrow: 0,
      alignItems: 'center',
      color: '#ffffff',
      '& p': {
        fontSize: '14px',
        fontFamily: 'Open Sans',
        fontWeight: '400',
        margin: '0',
      },
    },
  };

  overridesObj.MuiDialog = MuiDialog;
  overridesObj.MuiDialogContent = MuiDialogContent;
  overridesObj.MuiDialogTitle = MuiDialogTitle;
  
  const computedTheme = createTheme(Object.assign({}, themes.light, overrides, overridesObj));

  return (
    <ThemeProvider theme={computedTheme}>
      {children}
    </ThemeProvider>
  );
};
