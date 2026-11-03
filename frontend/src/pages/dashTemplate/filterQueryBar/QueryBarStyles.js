import { facetSectionThemes } from '../../../bento/facetSectionTheme';

export const customStyles = {
  facetSectionCases: {
    color: '#0B7562',
    backgroundColor: '#FFFFFF',
    border: '1px solid #898989',
  },
  localFindBackground: {
    color: '#244B44',
    backgroundColor: '#DCEFEC',
    border: '1px solid #0B7562',
  },
  ...facetSectionThemes.reduce((styles, { section, color, checkedEven, chipBorder }) => {
    const name = section.replace(/\s+/g, '');
    return {
      ...styles,
      [`facetSection${name}`]: {
        color,
        backgroundColor: '#FFFFFF',
        border: '1px solid #898989',
      },
      [`facetSection${name}Background`]: {
        color: '#0E3151',
        backgroundColor: checkedEven,
        border: `1px solid ${chipBorder}`,
      },
    };
  }, {}),
  operators: {
    fontSize: '10px',
  },
  clearQueryButton: {
    margin: '1px',
    marginLeft: -6,
    fontWeight: 600,
    fontSize: '13px',
    color: '#fff',
    borderRadius: '15px',
    fontFamily: 'Nunito',
    lineHeight: '22.75px',
    boxSizing: 'border-box',
    backgroundColor: '#757575',
    textTransform: 'capitalize',
    border: '1px solid #B4B4B4',
    padding: '1px 5px 0px 6px',
    '&:hover': {
      backgroundColor: '#757575',
    },
  },
};
