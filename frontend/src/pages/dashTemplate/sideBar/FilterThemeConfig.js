import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { facetSectionThemes } from '../../../bento/facetSectionTheme';

export const theme = {
  overrides: {
    Mui: {
      '&$expanded': {
        margin: '0px 0px',
      },
      checked: {
        color: 'red',
      },
    },
    MuiAccordionDetails: {
      root: {
        padding: '0px 1px 0px',
      },
    },
    MuiAccordion: {
      root: {
        '&$expanded': {
          margin: 'auto',
        },
      },
    },
    MuiAccordionSummary: {
      content: {
        margin: '0',
      },
    },
    MuiList: {
      padding: {
        paddingTop: '0',
        paddingBottom: '0',
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&:first-child': {
          color: '#000000',
        },
      },
    },
    MuiListItem: {
      root: {
        ...facetSectionThemes.reduce((styles, { section, checkedEven, checkedOdd }) => {
          const name = section.toLowerCase().replace(/\s+/g, '_');
          return {
            ...styles,
            [`&.${name}CheckedEven`]: { backgroundColor: checkedEven },
            [`&.${name}CheckedOdd`]: { backgroundColor: checkedOdd },
          };
        }, {}),
      },      
    },
    MuiSvgIcon: {
      root: {
        ...facetSectionThemes.reduce((styles, { section, color }) => ({
          ...styles,
          [`&.${section.toLowerCase().replace(/\s+/g, '_')}CheckedIcon`]: { color },
        }), {}),
      },
    },
    MuiTypography: {
      root: {
        ...facetSectionThemes.reduce((styles, { section, color }) => ({
          ...styles,
          [`&.${section.toLowerCase().replace(/\s+/g, '_')}Subjects`]: {
            color,
            fontSize: '12px',
            fontFamily: 'Nunito',
            marginRight: '0px',
          },
        }), {}),
      },
    },
    MuiDivider: {
      middle: {
        marginLeft: '0px',
        marginRight: '0px',
      },
      root: {
        height: '5px',
        ...facetSectionThemes.reduce((styles, { color }, index) => ({
          ...styles,
          [`&.divider${index}`]: { backgroundColor: color },
        }), {}),
      },
    },
    checkboxRoot: {
      color: 'inherit',
      '&$checked': {
        color: '#8DCAFF',
      },
    },
    MuiCollapse: {
      wrapperInner: {
        '& div.min_input_box': {
          width: '50%',
        },
        '& div.max_input_box': {
          width: '50%',
        },
      },
    },
  },
};

export default ({
  children,
}) => {
  const computedTheme = createTheme(theme);
  return (
    <ThemeProvider theme={computedTheme}>
      {children}
    </ThemeProvider>
  );
};
