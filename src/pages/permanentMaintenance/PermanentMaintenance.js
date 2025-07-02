import React from 'react';
import {
  Grid, Paper, Typography, withStyles,
} from '@material-ui/core';
import LeftBg from '../../assets/error/leftBg.png';
import rightBg from '../../assets/error/rightBg.png';
import usePageTitle from '../../components/Analytics/usePageTitle';

const PermanentMaintenance = ({ classes }) => {
  usePageTitle("Under Maintenance");

  return (
    <div className={classes.container}>
      <Grid container className={classes.container2}>
        <Grid item xs={3} className={classes.leftBg}> </Grid>
        <Grid item xs={6}>
          <Paper classes={{ root: classes.paperRoot }}>
            <div className={classes.maintenanceCodeText}>Scheduled Maintenance</div>
            <div className={classes.maintenanceTextRow}>
              <Typography className={classes.maintenanceText}>
                We’re performing scheduled maintenance on The General Commons.&nbsp;
                We’ll be back online soon—thanks for your patience!
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={3} className={classes.rightBg} />
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    marginTop: '-49px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#e7edf4',
    top: 0,
    left: 0,
    borderTop: '4px solid #417d96',
  },
  maintenanceCodeText: {
    letterSpacing: 4,
    color: '#000',
    fontFamily: 'Oswald',
    fontSize: 100,
    fontWeight: 500,
    textAlign: 'center',
  },
  divider: {
    height: '1px',
    width: '800px',
  },
  paperRoot: {
    boxShadow: 'none',
    background: '#e7edf4',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 12,
    paddingBottom: theme.spacing.unit * 16,
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
  },
  boldText: {
    color: '#204C5B',
    fontFamily: 'Raleway',
    fontSize: 19,
    fontWeight: 600,
    textAlign: 'center',
  },
  maintenanceTextRow: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 50,
    alignItems: 'center',
  },
  maintenanceText: {
    color: '#417D96',
    fontFamily: 'Lato',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#39C0F0',
    textDecoration: 'underline',
  },
  leftBg: {
    backgroundRepeat: 'no-repeat',
    background: `url(${LeftBg})`,
    backgroundPosition: 'right',
  },
  rightBg: {
    backgroundRepeat: 'no-repeat',
    background: `url(${rightBg})`,
    backgroundPosition: 'left',

  },
  container2: {
    maxWidth: '1200px',
  },
});

export default withStyles(styles, { withTheme: true })(PermanentMaintenance);
