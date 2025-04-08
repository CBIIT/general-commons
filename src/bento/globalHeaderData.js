import usaFlagSmall from '../assets/header/US_Flag_Small.svg';
import { STATIC_CONTENT } from '../assets/staticContent';

// globalHeaderLogo image 468x100
// globalHeaderImage: image 2200x100
export const headerData = {
  globalHeaderLogo: STATIC_CONTENT.logo.CRDC_LOGO_SVG,
  globalHeaderLogoSmall: STATIC_CONTENT.logo.CRDC_LOGO_SVG,
  globalHeaderLogoLink: '/home',
  globalHeaderLogoAltText: 'Portal Logo',
  usaFlagSmall,
  usaFlagSmallAltText: 'usaFlagSmall',
};

export const HeaderLinks = [
  {
    name: 'Home',
    link: '/home',
    id: 'navbar-dropdown-home',
    className: 'navMobileItem',
  },
  {
    name: 'Data',
    link: '/data',
    id: 'navbar-dropdown-data',
    className: 'navMobileItem',
  },
  {
    name: 'Programs',
    link: '/programs',
    id: 'navbar-dropdown-programs',
    className: 'navMobileItem',
  },
  {
    name: 'Studies',
    link: '/studies',
    id: 'navbar-dropdown-studies',
    className: 'navMobileItem',
  },
  {
    name: 'About',
    link: '#',
    id: 'navbar-dropdown-about',
    className: 'navMobileItem clickable',
  },
];

export const HeaderSubLinks = {
  About: [
    {
      name: 'About\nGeneral Commons',
      link: '/GeneralCommons',
      id: 'about-cancer-data-service',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Model',
      link: '/resources',
      id: 'about-resources',
      className: 'navMobileSubItem',
    },
    {
      name: 'Submission Requests',
      link: 'https://datacommons.cancer.gov/submit#2',
      id: 'about-submission-requests',
      className: 'navMobileSubItem',
    },
    {
      name: 'Query the GC\nusing GraphQL',
      link: '/graphql',
      id: 'about-graphql',
      className: 'navMobileSubItem',
    },
    {
      name: 'GC User Guide',
      link: STATIC_CONTENT.about.USER_GUIDE_PDF,
      id: 'about-user-guide',
      className: 'navMobileSubItem',
    },
    {
      name: 'GC Releases',
      link: '/releases',
      id: 'about-releases',
      className: 'navMobileSubItem',
    },
  ],
};
