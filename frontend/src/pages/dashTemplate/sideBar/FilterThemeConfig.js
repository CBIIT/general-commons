import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = {
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
        '&.demographicsCheckedEven': {
          backgroundColor: '#DCE9EF',
        },
        '&.demographicsCheckedOdd': {
          backgroundColor: '#F2FBFF',
        },
        '&.studyCheckedEven': {
          backgroundColor: '#F4E7F3',
        },
        '&.studyCheckedOdd': {
          backgroundColor: '#FFF5FF',
        },
        '&.data_accessCheckedEven': {
          backgroundColor: '#F3ECE5',
        },
        '&.data_accessCheckedOdd': {
          backgroundColor: '#FFFCFA',
        },
        '&.samplesCheckedEven': {
          backgroundColor: '#DCE9EF',
        },
        '&.samplesCheckedOdd': {
          backgroundColor: '#F2FBFF',
        },
        '&.genomicCheckedEven': {
          backgroundColor: '#F4E7F3',
        },
        '&.genomicCheckedOdd': {
          backgroundColor: '#FFF5FF',
        },
        '&.imagingCheckedEven': {
          backgroundColor: '#F3ECE5',
        },
        '&.imagingCheckedOdd': {
          backgroundColor: '#FFFCFA',
        },
        '&.diagnosisCheckedEven': {
          backgroundColor: '#DCE9EF',
        },
        '&.diagnosisCheckedOdd': {
          backgroundColor: '#F2FBFF',
        },
        '&.filesCheckedEven': {
          backgroundColor: '#F4E7F3',
        },
        '&.filesCheckedOdd': {
          backgroundColor: '#FFF5FF',
        },
        '&.proteomicCheckedEven': {
          backgroundColor: '#F3ECE5',
        },
        '&.proteomicCheckedOdd': {
          backgroundColor: '#FFFCFA',
        },
        '&.cancer_nanotechnologyCheckedEven': {
          backgroundColor: '#DCE9EF',
        },
        '&.cancer_nanotechnologyCheckedOdd': {
          backgroundColor: '#F2FBFF',
        },
      },      
    },
    MuiSvgIcon: {
      root: {
        '&.demographicsCheckedIcon': {
          color: '#0E6292',
        },
        '&.studyCheckedIcon': {
          color: '#942A90',
        },
        '&.data_accessCheckedIcon': {
          color: '#A35719',
        },
        '&.samplesCheckedIcon': {
          color: '#0E6292',
        },
        '&.genomicCheckedIcon': {
          color: '#942A90',
        },
        '&.imagingCheckedIcon': {
          color: '#A35719',
        },
        '&.diagnosisCheckedIcon': {
          color: '#0E6292',
        },
        '&.filesCheckedIcon': {
          color: '#942A90',
        },
        '&.proteomicCheckedIcon': {
          color: '#A35719',
        },
        '&.cancer_nanotechnologyCheckedIcon': {
          color: '#0E6292',
        },
      },
    },
    MuiTypography: {
      root: {
        '&.demographicsSubjects': {
          color: '#0E6292',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.studySubjects': {
          color: '#942A90',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.data_accessSubjects': {
          color: '#A35719',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.samplesSubjects': {
          color: '#0E6292',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.genomicSubjects': {
          color: '#942A90',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.imagingSubjects': {
          color: '#A35719',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.diagnosisSubjects': {
          color: '#0E6292',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.filesSubjects': {
          color: '#942A90',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.proteomicSubjects': {
          color: '#A35719',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
        '&.cancer_nanotechnologySubjects': {
          color: '#0E6292',
          fontSize: '12px',
          fontFamily: 'Nunito',
          marginRight: '0px',
        },
      },
    },
    MuiDivider: {
      middle: {
        marginLeft: '0px',
        marginRight: '0px',
      },
      root: {
        height: '5px',
        '&.divider0': {
          backgroundColor: '#0E6292',
        },
        '&.divider1': {
          backgroundColor: '#942A90',
        },
        '&.divider2': {
          backgroundColor: '#A35719',
        },
        '&.divider3': {
          backgroundColor: '#0E6292',
        },
        '&.divider4': {
          backgroundColor: '#942A90',
        },
        '&.divider5': {
          backgroundColor: '#A35719',
        },
        '&.divider6': {
          backgroundColor: '#0E6292',
        },
        '&.divider7': {
          backgroundColor: '#942A90',
        },
        '&.divider8': {
          backgroundColor: '#A35719',
        },
        '&.divider9': {
          backgroundColor: '#0E6292',
        },
        '&.divider10': {
          backgroundColor: '#942A90',
        },
        '&.divider11': {
          backgroundColor: '#A35719',
        },
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
