import { CssBaseline, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { common } from '@material-ui/core/colors';
import { createMuiTheme, createStyles, MuiThemeProvider, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { LockOutlined, PermIdentity } from '@material-ui/icons';
import * as React from 'react';
import { Provider } from 'react-redux';
import RemoteSubmitButton from './RemoteSubmitButton';
import RemoteSubmitForm from './RemoteSubmitForm';
import store from './Store';

// tslint:disable:object-literal-sort-keys
const themeDark = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: common.white
    },
    common: { black: common.black },
    text: { primary: common.black },
    primary: {
      main: '#00d2c1',
      contrastText: common.white
    }
  }
});

const styles = ({ palette, spacing }: Theme) => (createStyles({
  root: {
    flexGrow: 1,
    backgroundColor: palette.background.paper
  },
  title: {
    background: palette.common.black,
    color: palette.primary.contrastText,
    margin: 0,
    padding: spacing.unit * 2,
    textAlign: 'center',
  },
  icon: {
    color: palette.common.black
  },
  instructions: {
    listStyleType: 'none'
  },
}));
// tslint:enable:object-literal-sort-keys

class App extends React.Component<WithStyles<typeof styles>> {
  public render() {
    const { classes } = this.props;
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={themeDark}>
          <CssBaseline />
          <Grid container={true} className={classes.root} direction="row" alignItems="center" justify="center">
            <Grid item={true} xs={12}>
              <h2 className={classes.title}>Material-UI Remote Submit Example</h2>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true} direction="column" alignItems="center" justify="center">
                <Grid item={true} xs={8}>
                  <List component="nav">
                    <ListItem>
                      <ListItemIcon className={classes.icon}>
                        <PermIdentity />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                        Usernames that will pass validation: `john`, `paul`, `george`, or
                        `ringo`.
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon className={classes.icon}>
                        <LockOutlined />
                      </ListItemIcon>
                      <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                        Valid password for all users: `redux-form`.
                      </ListItemText>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item={true} xs={8}>
                  <RemoteSubmitForm />
                </Grid>
                <Grid item={true} xs={8} alignContent="center" alignItems="center" justify="center">
                  <RemoteSubmitButton formName="remoteSubmit" variant="contained" isReset={true}
                  isClearSubmitErrors={true} tooltip="Click to remotely submit the form">
                    Submit
                  </RemoteSubmitButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);