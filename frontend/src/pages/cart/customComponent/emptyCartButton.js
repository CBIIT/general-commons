import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, Typography, withStyles } from '@material-ui/core';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { onDeleteAllCartFile } from '@bento-core/cart';
import { cartActionButtonStyle } from './exportButton/exportStyles';

const EmptyCartButton = ({ classes, filesId = [], emptyCart }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button className={classes.emptyCartButton} disabled={filesId.length === 0} disableRipple onClick={() => setDialogOpen(true)}>
        Empty Cart
      </Button>
      <MuiThemeProvider theme={dialogTheme}>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="empty_cart_dialog_title"
          aria-describedby="empty_cart_dialog_description"
        >
          <DialogContent>
            <Typography id="empty_cart_dialog_title" component="h2" className={classes.title}>
              Remove all items from cart?
            </Typography>
            <Typography id="empty_cart_dialog_description" className={classes.body}>
              This will remove every item currently in your cart.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus disableRipple className={classes.cancelButton} onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disableRipple
              className={classes.confirmButton}
              onClick={() => {
                emptyCart();
                setDialogOpen(false);
              }}
            >
              Remove All Items
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    </>
  );
};

const dialogTheme = createTheme({
  overrides: {
    MuiDialog: {
      paper: {
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        borderRadius: '5px',
        boxShadow: 'none',
        width: '573px',
        minHeight: '221px',
        maxWidth: '573px',
        overflowY: 'visible',
        padding: '30px 38px',
      },
      paperWidthSm: {
        maxWidth: '573px',
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: '#4a4a4a52',
      },
    },
    MuiDialogContent: {
      root: {
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        gap: '20px',
        overflowY: 'visible',
        padding: '0px',
      },
    },
    MuiDialogActions: {
      root: {
        justifyContent: 'center',
        gap: '24px',
        padding: '20px 0px 0px 0px',
      },
      spacing: {
        '& > :not(:first-child)': {
          marginLeft: 0,
        },
      },
    },
  },
});

const WARNING_COLOR = '#931933';

const ctaButton = {
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '41px',
  minWidth: '173px',
  padding: '12px 30px',
  borderRadius: '5px',
  boxShadow: 'none',
  fontFamily: 'Poppins',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: '16px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
};

const styles = () => ({
  emptyCartButton: {
    ...cartActionButtonStyle({ color: WARNING_COLOR }),
    '&.Mui-disabled': {
      opacity: 0.4,
      color: WARNING_COLOR,
      borderColor: WARNING_COLOR,
    },
  },
  title: {
    color: '#000000',
    fontFamily: 'Open Sans',
    fontSize: '17px',
    fontWeight: 700,
    lineHeight: '22px',
    margin: 0,
    textAlign: 'center',
  },
  body: {
    color: '#000000',
    fontFamily: 'Open Sans',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '18px',
    textAlign: 'center',
  },
  cancelButton: {
    ...ctaButton,
    backgroundColor: '#FFFFFF',
    border: '1.25px solid #4F5D69',
    color: '#4F5D69',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none',
    },
  },
  confirmButton: {
    ...ctaButton,
    backgroundColor: '#AC1F3D',
    border: '1.25px solid #FFFFFF',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#AC1F3D',
      boxShadow: 'none',
    },
  },
});

const mapStateToProps = (state) => ({
  filesId: state.cartReducer.filesId,
});

const mapDispatchToProps = (dispatch) => ({
  emptyCart: () => dispatch(onDeleteAllCartFile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EmptyCartButton));
