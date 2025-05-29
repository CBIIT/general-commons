import React, { useEffect, useState } from 'react';
import { withStyles, CssBaseline } from '@material-ui/core';
import { HashRouter, Route, Switch, Prompt, Redirect, useHistory, useLocation } from 'react-router-dom';
import aboutPageRoutes from '../../bento/aboutPagesRoutes';
import Header from '../Header/HeaderView';
import Footer from '../Footer/FooterView';
import { STATIC_CONTENT } from '../../assets/staticContent';
import Error from '../../pages/error/Error';
import Maintenance from '../../pages/maintenance/Maintenance';
import CaseDetail from '../../pages/caseDetail/caseDetailController';
import table from '../../pages/table/tableView';
import Home from '../../pages/landing/landingController';
import About from '../../pages/about/aboutController';
import DataDictonary from '../../pages/dataDictionary/dataDictonaryController';
import Programs from '../../pages/programs/programsController';
import ProgramDetail from '../../pages/programDetail/programDetailController';
import Studies from '../../pages/studies/studiesController';
import StudyDetail from '../../pages/studyDetail/studyDetailController';
import GraphqlClient from '../GraphqlClient/GraphqlView';
// import JBrowse from '../JBrowse/JBrowseView';
import JBrowseDetail from '../../pages/jbrowseDetail/jbrowseDetailController';
import GlobalSearchController from '../../pages/search/searchViewController';
import adminController from '../../pages/admin/adminController';
import reviewRequestController from '../../pages/admin/reviewPendingDAR/reviewRequestController';
import Login from '../../pages/login';
import RequestAccess from '../../pages/requestAccess/requestAccessController';
import SysInfoView from '../../pages/sysInfo/view';
import ProfileController from '../../pages/profile/profileController';
import editUserController from '../../pages/admin/userDetails/editUserController';
import viewUserController from '../../pages/admin/userDetails/viewUserController';
import OverlayWindow from '../OverlayWindow/OverlayWindow';
import AUTH_MIDDLEWARE_CONFIG from '../Auth/authMiddlewareConfig';
import CarView from '../../pages/cart/cartController';
import AuthSessionTimeoutController from '../SessionTimeout/SessionTimeoutController';
import { AuthenticationMiddlewareGenerator } from '@bento-core/authentication';

import Notifactions from '../Notifications/NotifactionView';
import DashTemplate from '../../pages/dashTemplate/DashTemplateController';
import ReleaseNotes from '../../pages/ReleaseNotes';
import TextBanner from '../TextBanner';
import axios from 'axios';



const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

const Layout = ({ classes, isSidebarOpened }) => {
  // Access control imports
  const { LoginRoute, MixedRoute, PrivateRoute, AdminRoute } = AuthenticationMiddlewareGenerator(AUTH_MIDDLEWARE_CONFIG);

  const [isMaintenanceModeEnabled, setIsMaintenanceModeEnabled] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    axios.get(STATIC_CONTENT.siteWideSettings)
    .then(response => {
      const maintenance = response.data.maintenanceModeEnabled;
      setIsMaintenanceModeEnabled(maintenance);
      if (maintenance && location.hash !== '/') {
        history.replace('/');
      }
    })
    .catch(error => {
      console.error(error, 'Failed to gather settings')
    })
  }, [location.hash]);

  return (
    <>
      <CssBaseline />
      <HashRouter>
        <>
          <Prompt
            when={isMaintenanceModeEnabled}
            message={() => false}
          />
          <Notifactions />
          <AuthSessionTimeoutController />
          <TextBanner
            heading="CRDC’s Cancer Data Service (CDS) is now the General Commons (GC): Hosting and sharing NCI data of multiple data types that are not a match for other Data Commons."
            aria-label="GC announcement banner"
          />
          <Header />
          <OverlayWindow />
          {/* Reminder: Ajay need to replace the ICDC with env variable and
          change build npm to read env variable */}
          <div className={classes.content}>
            <Route component={ScrollToTop} />

            {isMaintenanceModeEnabled ? (
              <Route component={Maintenance} />
            ) : (
              <Switch>
                <MixedRoute exact path="/" component={Home} />
                <MixedRoute exact path="/home" component={Home} />

                {/* START: Private Routes */}
                {/* SECTION: Non-Member & Member only Path */}
                <PrivateRoute path="/request" requiuredSignIn access={['member', 'non-member']} component={RequestAccess} />
                                <PrivateRoute path="/profile" requiuredSignIn access={['member', 'non-member', 'admin']} component={ProfileController} />
                {/* END SECTION */}

                {/* SECTION: Member & Admin only Path */}
                <PrivateRoute path="/programs" access={['admin', 'member']} component={Programs} />
                <PrivateRoute path="/studies" access={['admin', 'member']} component={Studies} />
                <PrivateRoute path="/fileCentricCart" access={['admin', 'member']} component={CarView} />
                <PrivateRoute path="/program/:id" access={['admin', 'member']} component={ProgramDetail} />
                <PrivateRoute path="/study/:id" access={['admin', 'member']} component={StudyDetail} />
                <PrivateRoute path="/case/:id" access={['admin', 'member']} component={CaseDetail} />
                <PrivateRoute path="/fileViewer/:id" requiuredSignIn access={['admin', 'member']} component={JBrowseDetail} />
                {/* bento 4.0 template */}
                <PrivateRoute exact path="/data" access={['admin', 'member']} component={DashTemplate} />
                <PrivateRoute exact path="/data/:filterQuery" access={['admin', 'member']} component={DashTemplate} />

                {/* END SECTION */}

                {/* SECTION: Admin only Path */}
                <AdminRoute path="/admin/edit/:id" requiuredSignIn access={['admin']} component={editUserController} />
                <AdminRoute path="/admin/view/:id" requiuredSignIn access={['admin']} component={viewUserController} />
                <AdminRoute path="/admin/review/:id" requiuredSignIn access={['admin']} component={reviewRequestController} />
                <AdminRoute path="/admin" access={['admin']} requiuredSignIn component={adminController} />
                {/* END SECTION */}

                {/* NOTE: Please check these below paths. if no longer needed please remove it */}
                {/* <PrivateRoute path="/JBrowse"
            access={['admin', 'member']} component={JBrowse} /> */}
                <PrivateRoute path="/table" component={table} />
                {/* END NOTE */}

                {/* Psuedo Private routes where minor
                functionality can be accessed my unauthorized users */}
                <Route exact path="/search" access={['admin', 'member', 'non-member']} component={GlobalSearchController} />
                <Route path="/search/:id" access={['admin', 'member', 'non-member']} component={GlobalSearchController} />

                {/* END: Private Routes */}

                {aboutPageRoutes.map(
                  (aboutPageRoute, index) => (
                    <Route
                      key={index}
                      path={aboutPageRoute}
                      component={About}
                    />
                  ),
                )}
                <Route path="/releases" component={ReleaseNotes} />
                <Route path="/data-dictionary" component={DataDictonary} />
                <Route path="/graphql" component={GraphqlClient} />
                <LoginRoute path="/login" component={Login} />
                <Route path="/sysinfo" component={SysInfoView} />
                <Route component={Error} />
              </Switch>
            )}
            <Footer data={{ isSidebarOpened }} />
          </div>
        </>
      </HashRouter>
    </>
  )};

const styles = (theme) => ({
  root: {
    display: 'flex',
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  content: {
    flexGrow: 1,
    // width: `calc(100vw - 240px)`,   // Ajay need to add this on addung side bar
    width: 'calc(100%)', // Remove this on adding sidebar
    background: theme.custom.bodyBackGround,
    marginTop: '0',
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.5em',
      height: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px #ccc',
      borderRadius: '0px',
      backgroundColor: '#FFFFFF',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#97b0c0',
      outline: '1px solid slategrey',
      borderRadius: '0px',
    },
  },
});

export default withStyles(styles)(Layout);
