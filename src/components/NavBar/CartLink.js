import React from 'react';
import { Box, Tooltip, withStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const CartLink = ({ navBarCartData, numberOfCases, classes }) => {
  const getCartLabel = (labelType) => {
    return (
      <div className={classes.cartCounter2Wrapper}>
        <div className={classes.cartCounter2}>{numberOfCases}</div>
        <div className={classes.cartLabel}>Files</div>
      </div>
    );
  };

  return (
    <Box
      id="button_navbar_mycases"
      className={classes.logotype}
      classes={{ root: classes.buttonRootNoRightPadding }}
    >
      <NavLink className={classes.cartLabelText} to={navBarCartData.cartLink}>
        {navBarCartData.cartLabel}
        <Tooltip title="Files" placement="bottom-end">
          <span className={classes.badge}>
            <img
              className={classes.cartIcon}
              src={navBarCartData.cartIcon}
              alt={navBarCartData.cartIconAlt}
            />
            {getCartLabel(navBarCartData.cartLabelType)}
          </span>
        </Tooltip>
      </NavLink>
    </Box>
  );
};

const styles = () => ({
  cartCounter2Wrapper: {
    marginTop: '0',
    marginLeft: '5px',
  },
  cartCounter2: {
    color: '#0E6292',
    lineHeight: '13px',
    minWidth: '16px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    letterSpacing: '0.08rem',
    textAlign: 'start',
    fontSize: '12px',
  },
  cartLabel: (props) => ({
    color:
      props.navBarstyling &&
      props.navBarstyling.cartLabel &&
      props.navBarstyling.cartLabel.color
        ? props.navBarstyling.cartLabel.color
        : '#E37B22',
    lineHeight: '13px',
    minWidth: '16px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    letterSpacing: '0.08rem',
    textAlign: 'start',
    fontSize: '12px',
  }),
  logotype: (props) => ({
    whiteSpace: 'nowrap',
    color: '#FFFFFF',
    fontFamily:
      props.navBarstyling && props.navBarstyling.global.fontFamily
        ? props.navBarstyling.global.fontFamily
        : 'Raleway',
    fontSize: '11px',
    letterSpacing:
      props.navBarstyling && props.navBarstyling.global.letterSpacing
        ? props.navBarstyling.global.letterSpacing
        : '1.25px',
    fontWeight:
      props.navBarstyling && props.navBarstyling.global.fontWeight
        ? props.navBarstyling.global.fontWeight
        : '800',
    '&:hover, &:focus': {
      borderRadius: '0',
    },
  }),
  buttonRootNoRightPadding: (props) => ({
    padding:
      props.navBarstyling &&
      (props.navBarstyling.cart.padding ||
        props.navBarstyling.global.padding ||
        '9px 20px 0px 20px'),
    border: '0',
    cursor: 'pointer',
    margin: '0',
    display: 'inline-flex',
    position: 'relative',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
    lineHeight: '1.75',
  }),
  cartLabelText: (props) => ({
    textDecoration: 'none',
    color:
      props.navBarstyling && props.navBarstyling.global.fontColor
        ? props.navBarstyling.global.fontColor
        : '#FFFFFF',
    fontFamily:
      props.navBarstyling && props.navBarstyling.global.fontFamily
        ? props.navBarstyling.global.fontFamily
        : 'Nunito',
    textTransform:
      props.navBarstyling && props.navBarstyling.global.textTransform
        ? props.navBarstyling.global.textTransform
        : 'UPPERCASE',
    fontSize: '13px',
  }),
  badge: {
    display: 'inline-flex',
    position: 'relative',
    verticalAlign: 'middle',
  },
  cartIcon: (props) => ({
    width: '33px',
    height:
      props.navBarstyling &&
      props.navBarstyling.cart &&
      props.navBarstyling.cart.iconSize
        ? props.navBarstyling.cart.iconSize
        : '27px',
    margin: '0px 0px 0px 6px',
  }),
});

export default withStyles(styles)(CartLink);

