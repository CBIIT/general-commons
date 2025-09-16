import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Header } from "@bento-core/header";
import { withRouter } from "react-router-dom";
import { SearchBarGenerator } from "@bento-core/global-search";
import * as HeaderData from "../../bento/globalHeaderData";
import {
  queryAutocompleteAPI,
  SEARCH_DATAFIELDS,
  SEARCH_KEYS,
} from "../../bento/search";
import { PUBLIC_ACCESS } from "../../bento/siteWideConfig";
import { accessLevelTypes } from "@bento-core/authentication";
import CartLink from "../NavBar/CartLink";
import { navBarCartData } from "../../bento/navigationBarData";
import styles from "./styles";
import { useMediaQuery, withStyles } from "@material-ui/core";
import searchSmallIcon from "./assets/Search_Small_Icon.svg";

const ICDCHeader = ({ classes }) => {
  const tabletAndMobile = useMediaQuery("(max-width: 1024px)");
  const isSignedIn = useSelector((state) => state && state.login.isSignedIn);
  const isAdmin = useSelector(
    (state) => state.login && state.login.role && state.login.role === "admin"
  );
  const hasApprovedArms = useSelector(
    (state) =>
      state.login.acl &&
      state.login.acl.some((arm) => arm.accessStatus === "approved")
  );
  const authenticated =
    PUBLIC_ACCESS === accessLevelTypes.METADATA_ONLY ||
    (isSignedIn && (hasApprovedArms || isAdmin));
  const { filesId: cartFieldIds } = useSelector((state) => state.cartReducer);

  const SearchBarConfig = {
    config: {
      query: async (search) => queryAutocompleteAPI(search, !authenticated),
      searchKeys: authenticated ? SEARCH_KEYS.private : SEARCH_KEYS.public,
      searchFields: authenticated
        ? SEARCH_DATAFIELDS.private
        : SEARCH_DATAFIELDS.public,
      placeholder: "SEARCH GC",
      ariaLabel: "Search GC",
    },
    classes,
  };

  const searchBarRef = useRef(null);
  const { SearchBar } = SearchBarGenerator(SearchBarConfig);
  const hideSearchBar = window.location.hash.includes("/search");

  return (
    <Header
      config={HeaderData}
      SearchComponent={
        !hideSearchBar ? (
          <div className={classes.searchBarContainer}>
            <SearchBar ref={searchBarRef} />

            <div
              className={classes.searchButton}
              onClick={() => searchBarRef.current.triggerSearch()}
            >
              {tabletAndMobile ? (
                <img src={searchSmallIcon} alt="Search icon" />
              ) : (
                "Search"
              )}
            </div>
          </div>
        ) : null
      }
      endComponent={
        <CartLink
          navBarCartData={navBarCartData}
          numberOfCases={cartFieldIds.length || 0}
        />
      }
    />
  );
};

export default withRouter(withStyles(styles)(ICDCHeader));

