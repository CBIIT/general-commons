export const cartActionButtonStyle = ({ color, borderColor = color }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  minWidth: '234px',
  padding: '10px 21px',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${borderColor}`,
  borderRadius: '10px',
  boxShadow: 'none',
  color,
  fontFamily: 'Roboto',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '24px',
  letterSpacing: '0.025em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${borderColor}`,
    boxShadow: 'none',
  },
});

const exportButtonBase = cartActionButtonStyle({ color: '#5F2E05', borderColor: '#686868' });
const noBorderTransition = 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms';

export const exportStyles = () => ({
  dropdownWrapper: {
    position: 'relative',
    marginTop: '6px',
    marginBottom: '10px',
  },
  availableDownloadDropdownBtn: {
    ...exportButtonBase,
    margin: 0,
    transition: noBorderTransition,
  },
  availableDownloadDropdownBtnIsOpen: {
    ...exportButtonBase,
    margin: 0,
    transition: noBorderTransition,
    border: 'none',
    borderTop: '1px solid #686868',
    borderRight: '1px solid #686868',
    borderLeft: '1px solid #686868',
    borderBottomRightRadius: '0px',
    borderBottomLeftRadius: '0px',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none',
    },
  },
  availableDownloadDropdownBtnStartIcon: {
    margin: '0px',
  },
  caret: {
    fontSize: '20px',
    transition: 'transform 200ms',
  },
  caretOpen: {
    fontSize: '20px',
    transition: 'transform 200ms',
    transform: 'rotate(180deg)',
  },
  menuItemIcon: {
    marginRight: '10px',
  },
  guidanceTooltip: {
    border: '#dc762f 1px solid',
  },
  guidanceTooltipArrow: {
    '&::before': {
      border: '#dc762f 1px solid',
    },
  },
  dropdownMenuList: {
    paddingTop: '0px',
    paddingBottom: '0px',
    backgroundColor: '#0e6292',
    color: '#FFFFFF',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    overflow: 'hidden',
  },
  dropdownPaper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    zIndex: 1,
    boxSizing: 'border-box',
    borderTopRightRadius: '0px',
    borderTopLeftRadius: '0px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
  },
  styledMenuItem: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '16px',
    textTransform: 'uppercase',
    minHeight: '48px',
  },
  manifestMenuItem: {
    backgroundColor: '#FFFFFF',
    color: '#0E6292',
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
  },
});
