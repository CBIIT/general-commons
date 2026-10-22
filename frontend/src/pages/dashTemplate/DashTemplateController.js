import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { getFilters } from '@bento-core/facet-filter';
import DashTemplateView from './DashTemplateView';
import { DASHBOARD_QUERY, tabIndexMap } from '../../bento/dashboardTabData';
import { setActiveFilterByPathQuery } from './sideBar/BentoFilterUtils';

const getDashData = (states) => {
  const {
    filterState,
    localFindUpload, localFindAutocomplete,
  } = states;

  const { search } = useLocation();

  const selectedTab = new URLSearchParams(search).get('selectedTab');
  const tabName = search && selectedTab ? selectedTab.toLowerCase() : 'participants';
  const tabIndex = tabIndexMap[tabName];

  const client = useApolloClient();
  async function getData(activeFilters) {
    const result = await client.query({
      query: DASHBOARD_QUERY,
      variables: activeFilters,
    })
      .then((response) => response.data);
    return result;
  }
  const [dashData, setDashData] = useState(null);
  const filters = getFilters(filterState);
  // protocolOverview uses protocol_pk_id (singular); facet path from ProtocolCard
  // sets protocol_pk_ids for searchSubjects/subjectOverview.
  const activeFilters = {
    ...filters,
    subject_ids: [
      ...(localFindUpload || []).map((obj) => obj.subject_id),
      ...(localFindAutocomplete || []).map((obj) => obj.title),
    ],
    ...(filters.protocol_pk_ids && filters.protocol_pk_ids.length
      ? { protocol_pk_id: filters.protocol_pk_ids }
      : {}),
  };
  useEffect(() => {
    const controller = new AbortController();
    getData(activeFilters).then((result) => {
      if (result.searchSubjects) {
        setDashData(result.searchSubjects);
      }
    });
    return () => controller.abort();
  }, [filterState, localFindUpload, localFindAutocomplete]);
  return { dashData, activeFilters, tabIndex };
};
const DashTemplateController = ((props) => {
  // redirect
  const { match, history } = props;
  if (match.params.filterQuery) {
    setActiveFilterByPathQuery(match);
    // Preserve selectedTab so ProtocolCard can open the Protocols tab
    // (which runs protocolOverview).
    const selectedTab = new URLSearchParams(history.location.search).get('selectedTab');
    history.replace(selectedTab ? `/data?selectedTab=${encodeURIComponent(selectedTab)}` : '/data');
  }
  const { dashData, activeFilters, tabIndex } = getDashData(props);
  if (!dashData) {
    return (<CircularProgress />);
  }
  return (
    <DashTemplateView
      {...props}
      dashData={dashData}
      activeFilters={activeFilters}
      tabIndex={tabIndex}
    />
  );
});
const mapStateToProps = (state) => ({
  filterState: state.statusReducer.filterState,
  localFindUpload: state.localFind.upload,
  localFindAutocomplete: state.localFind.autocomplete,
});
export default connect(mapStateToProps, null)(DashTemplateController);