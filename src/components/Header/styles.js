import clearIcon from "./assets/Clear_Icon.svg";

export const styles = () => ({
  root: {
    zIndex: 1501,
    "& .MuiAutocomplete-listbox": {
      borderRadius: "8px",
      fontFamily: "Lato",
      fontSize: "12px",
      color: "#142D64",
      fontWeight: 500,
      border: "2px solid #4A8ECB",
      borderTop: 0,
      padding: "0px",

      "& li": {
        borderBottom: "1px solid #3B68CB",
        "&:nth-last-child(1)": {
          borderBottom: "none",
          fontSize: "14px",
          color: "black",
          backgroundColor: "#ECECEC",
          "& :hover": {
            color: "black",
            backgroundColor: "#ECECEC",
            pointerEvents: "none",
          },
        },
      },
      "& :hover": {
        color: "white",
        backgroundColor: "#0088FF",
      },
    },
  },
  backdrop: {
    zIndex: 99999,
    background: "rgba(0, 0, 0, 0.1)",
  },
  autocomplete: {
    margin: "0 auto",
    width: "224px",
    height: "32px",
    paddingTop: 0,
    border: "1px solid rgb(113, 118, 122)",

    "@media (max-width:1024px)": {
      height: "43px",
    },
  },
  enterIcon: {
    height: "12px",
    margin: "0px 18px 0px 6px",
  },
  inputRoot: {
    width: "100%",
    height: "32px",
    padding: "0px !important",
    marginTop: "-1px",

    "@media (max-width:1024px)": {
      height: "43px",
      marginTop: "0px",
    },

    "& input": {
      margin: "-1px 0 0 -1px",
      padding: "0 7px !important",
      border: "none",
      fontFamily: "Open Sans",
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: "42px",
      color: "#1b1b1b",
      width: "224px !important",
      height: 32,
      background: "transparent",
      "&::placeholder": {
        color: "#a9b2b9",
        opacity: 1,
      },
      "&:focus": {
        outline: "0.25rem solid #2491ff",
      },
      "&::-webkit-search-cancel-button": {
        position: "relative",
        WebkitAppearance: "none",
        height: 20,
        width: 20,
        background: `url(${clearIcon}) right center no-repeat`,
        backgroundImage: `url(${clearIcon}) red`,
        backgroundSize: "20px",
        cursor: "pointer",
      },
      "&:focus::-webkit-search-cancel-button": {
        position: "relative",
        WebkitAppearance: "none",
        height: 20,
        width: 20,
        background: `url(${clearIcon}) right center no-repeat`,
        backgroundImage: `url(${clearIcon}) red`,
        backgroundSize: "20px",
        cursor: "pointer",
      },
      "@media (max-width:1024px)": {
        height: "43px",
        padding: "0 12px 0 14px !important",
      },
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },

    "& #global_search_input_find": {
      display: "none",
    },
  },
  inputAdornedEnd: {},
  textFieldRoot: {},
  searchIconSpan: {
    color: "#4A8ECB",
    stroke: "#4A8ECB",
    strokeWidth: "1.1px",
    marginRight: "8px",
    cursor: "pointer",
  },

  searchBarContainer: {
    display: "flex",
    "@media (max-width:1024px)": {
      marginLeft: "24px",
      paddingRight: "16px",
    },
  },
  searchBar: {
    marginLeft: "auto",
    width: 224,
    height: 32,
    border: "1px solid #71767a",
    "@media (max-width:1024px)": {
      height: "43px",
    },
  },
  searchButton: {
    zIndex: 1502,
    height: 32,
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontSize: "1rem",
    lineHeight: "33px",
    textAlign: "center",
    color: "#ffffff",
    background: "#007bbd",
    padding: "0 13px",
    borderRadius: "0px 5px 5px 0px",
    "&:hover": {
      cursor: "pointer",
      background: "#004971",
    },
    "@media (max-width:1024px)": {
      height: "43px",
      padding: "10px 14px",
      maxWidth: "48px",
    },
  },
});

export default styles;

