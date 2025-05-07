const styles = () => ({
  container: {
    '& h1': {
      fontSize: 35,
      fontWeight: 700, 
      color: '#0E6292', 
      textAlign: 'center',
      marginBottom: 40,
      paddingTop: 40,
      FontFamily: 'Lato',
      FontStyle: 'Bold',
    },

  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '1200px',
    margin: '0 auto 32px auto',
  },
  topBorder: {
    height: 5,
    backgroundColor: '#0E6292',
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  tableInside:{
    minWidth: 200,
    width: 362, 
    height: 'min-content', 
    border: '2px solid #CDD4D8',
    borderTop: 'none',
    borderBottom: 'none',
  },
  tableOutside:{
    minWidth: 200,
    width: 362, 
    height: 'min-content', 
    border: '2px solid #CDD4D8',
    borderTop: 'none',
  },
  tableHead: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '8px',
    color: '#004C73',
    fontFamily: 'Nunito Sans',
    padding: "5px 5px 5px 20px",
    letterSpacing: "0.025em",
    cursor: 'pointer', 
  },
  horizontalLine: {
    width: 40,
    margin: 0,
    backgroundColor: '#CDD4D8',
    border: 'none',
    height: 2,
    marginTop: 74,
  },
  tableWrapper: {
    display: 'flex',
  },
  version: { 
    fontFamily: 'Nunito', 
    color: ' #000000', 
    fontSize: '16px', 
    fontWeight: 400, 
    paddingLeft: 20, 
    lineHeight: '21.5px',
    boxSizing: 'border-box',
    letterSpacing: '0.021em',
  },
  yearSection:{
    borderTop: '.5px solid #969696'
  },
  yearHeader: {
    height: '44px',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#FFFFFF',
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    transition: 'background-color 0.3s ease',
  },
  hiddenYear: {
    maxHeight: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease',
    padding: 0,
    borderTop: 'none',
  },
  visibleYear: {
    maxHeight: '50px',
    opacity: 1,
    overflow: 'hidden',
    transition: 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease',
  },
  
  hiddenRow: {
    maxHeight: 0,
    opacity: 0,
    overflow: 'hidden',
    border: 'none !important',
    transition: 'max-height 0.4s ease, opacity 0.4s ease',
  },
  visibleRow: {
    maxHeight: 40,
    height: 40, // Adjust this height based on your row size
    opacity: 1,
    display: 'flex',
    transition: 'max-height 0.4s ease, opacity 0.4s ease',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  evenRow: {
    backgroundColor: '#DCE9EF',
  },
  oddRow: {
    backgroundColor: '#F2FBFF',
  },
  unselectedRow:{
    border: 'none',
  },
  dataSelectedRow:{
    //border: '1px solid #0E6292', //uncomment this if we want borders around selected rows
  }, 
  softwareSelectedRow:{
   //border: '1px solid #942A90', //uncomment this if we want borders around selected rows
  }, 
  dataVersion: {
    width: '50%',
    lineHeight: '40px',
    padding: "0px 5px 5px 20px",
    boxSizing: 'border-box',
  },
  dataDate: {
    width: '50%',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '40px',
    color: '#004C73',
    fontFamily: 'Nunito Sans',
    padding: "0px 5px 5px 20px",
    letterSpacing: "0.025em",
    boxSizing: 'border-box',
  },
  releaseHeading: { 
    fontFamily: 'Inter', 
    fontWeight: 400, 
    fontSize: '20px',
    color: "#004C73",
    lineHeight: "8px",
    overflowWrap: "break-word",
  }, 
  dataHeading: { 
    color: '#0E6292', 
    display: 'inline-block', 
    paddingBottom: 8, 
  },
  yearDropdown: {
    color: '#000000', 
    paddingTop: 0, 
    fontSize: 30,
  },
  releaseDropdown: { 
    color: '#000000', 
    paddingTop: 0, 
    marginBottom: -12, 
    fontSize: 40, 
  }, 
  upsideDown: { 
    transform: 'rotate(-180deg)', 
    transition: 'transform 0.4s ease',
  }, 
  rightsideUp: {
    transform: 'rotate(0deg)', 
    transition: 'transform 0.4s ease',
  },
  softwareBorder: {
    height: 5,
    backgroundColor: '#942A90',
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  softwareHeading: { 
    color: '#942A90', 
    display: 'inline-block', 
    paddingBottom: 8, 
  },
  softwareDate: {
    width: '50%',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '40px',
    color: '#942A90',
    fontFamily: 'Nunito Sans',
    padding: "0px 5px 5px 20px",
    letterSpacing: "0.025em",
    boxSizing: 'border-box',
  },
  softwareRows: {
    '& > div:nth-of-type(odd)': {
      backgroundColor: '#EFE8EC',
    },
    '& > div:nth-of-type(even)': {
      backgroundColor: '#FFFAFC',
    },
  },  
  softwareDropdown: { 
    fontSize: 14, 
    marginLeft: 7, 
  }, 
});

export default styles;
