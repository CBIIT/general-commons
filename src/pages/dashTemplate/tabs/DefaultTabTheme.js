export const customTheme = {
  MuiTabs: {
    root: {
      borderBottom: '10px solid #40789c',
    },
  },
  MuiTab: {
    root: {
      marginTop: '15px',
      color: '#6E6E6E',
      height: '45px',
      overflow: 'hidden',
      background: '#EAEAEA',
      borderTop: '1px solid black',
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
      fontWeight: '400',
      lineHeight: '18px',
      letterSpacing: '0.25px',
      marginRight: '10px',
      fontSize: '21px',
      width: '250px',
      textTransform: 'none',
      fontFamily: 'Lato',
      opacity: "1 !important",
      '&:not(.Mui-selected)': {
        color: '#686868',
      },
      '&.Mui-selected': {
        fontWeight: 'bolder',
        '&.participants': {
          background: '#DCE9EF',
          color: '#142D64',
          '& span.participants_count': {
            color: '#142D64',
          }
        },
        '&.samples': {
          background: '#F4E7F3',
          color: '#942A90',
          '& span.samples_count': {
            color: '#942A90',
          }
        },
        '&.files': {
          background: '#F3ECE5',
          color: '#A35719',
          '& span.files_count': {
            color: '#A35719',
          }
        },
        '&.MuiTypography-body1': {
          color: 'red',
        },
      },
      '& span.participants_count': {
        marginLeft: '12px',
        fontSize: '17px',
        color: '#686868',
        fontWeight: '500',
      },
      '& span.samples_count': {
        marginLeft: '12px',
        fontSize: '17px',
        color: '#686868',
        fontWeight: '500',
      },
      '& span.files_count': {
        marginLeft: '12px',
        fontSize: '17px',
        color: '#686868',
        fontWeight: '500',
      },
    },
  },
};
