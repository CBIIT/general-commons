const styles = () => ({
  releaseNotesContainer: {
    borderWidth: [[0, 0, 0, 2]],
    borderColor: '#CDD4D8',
    borderStyle: 'solid',
    width: '100%',
  },
  releaseNotesWrapper: {
    paddingLeft: 32,
    maxHeight: '1024px',
    overflowY: 'auto',
    marginTop: '22px',
  
    '&::-webkit-scrollbar': {
      width: '8px', // customize width
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#fff',
      borderRadius: '5px',
      '-webkit-box-shadow': 'none',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#D9D9D9',
      border: 'none',
      outline: 'none',
      backgroundClip: 'content-box',
      borderRadius: '5px',
    },
  },
  horizontalLine: {
    width: 120,
    margin: 0,
    backgroundColor: '#CDD4D8',
    border: 'none',
    height: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: '#43779A',
    fontFamily: 'Lato',
    fontStyle: 'normal',
    margin: "0px 0px 22px 0px",
    /* or 114% */

    letterSpacing: '0.14994',
  },
  releaseDateInfo: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'Nunito',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    fontFamily: 'Nunito',
  },
  infoWrapper: {
    color: '#000',
    lineHeight: '24px',
    '& div': {
      fontFamily: 'Nunito',
      marginBottom: 20,
      fontSize: 16,
      '& p': {
        fontFamily: 'Nunito',
        margin: 0,
        fontSize: 16,
        fontWeight: 400,
        whiteSpace: 'pre-wrap',
      },
      '& ul': {
        fontFamily: 'Nunito',
        fontSize: 16,
        margin: 0,
      },
    },
  },
});

export default styles;
