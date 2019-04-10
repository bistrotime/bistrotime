import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import queryString from 'query-string';
import empty from 'is-empty';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Drinkers from './components/drinkers';
import Pin from './components/pin';
import Bar from './components/bar';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  grid: {
    marginTop: theme.spacing.unit * 3,
  },
  drinkers: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200],
  },
});

class App extends React.Component {
  state = {
    viewport: {
      width: '100%',
      height: '60vh',
      latitude: 48.863066,
      longitude: 2.328776,
      zoom: 12,
    },
    bar: {},
    coords: [],
  };

  constructor(props) {
    super(props);

    this.handleDrinkersSubmit = this.handleDrinkersSubmit.bind(this);
    this.handleDrinkersChange = this.handleDrinkersChange.bind(this);
  }

  handleDrinkersChange(coords) {
    this.setState({ coords });
  }

  handleDrinkersSubmit(coords) {
    const qs = queryString.stringify({
      coords,
    });

    fetch(`${process.env.REACT_APP_BISTROTIME_API_URL}/finder?${qs}`)
      .then(response => response.json())
      .then((data) => {
        if (!empty(data.bar)) {
          this.setState({ bar: data.bar[0] });
        }
      });
  }

  render() {
    const { classes } = this.props;
    const { viewport, bar, coords } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
          <Toolbar className={classes.toolbar}>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              className={classes.toolbarTitle}
              noWrap
            >
              Bistro time
            </Typography>
          </Toolbar>
          <main>
            <Grid container spacing={40} className={classes.grid}>
              <Grid item xs={12} md={8}>
                <ReactMapGL
                  {...viewport}
                  onViewportChange={vp => this.setState({ viewport: vp })}
                >
                  {!empty(bar)
                    && (
                    <Marker
                      longitude={bar.coordinates.longitude}
                      latitude={bar.coordinates.latitude}
                    >
                      <Pin fill="#c00" />
                    </Marker>
                    )
                  }
                  {coords.map(coord => (
                    <Marker
                      key={coord.id}
                      longitude={parseFloat(coord.split(',')[1])}
                      latitude={parseFloat(coord.split(',')[0])}
                    >
                      <Pin />
                    </Marker>
                  ))}
                </ReactMapGL>
              </Grid>
              <Grid item xs={12} md={4}>
                {!empty(bar)
                  && <Bar info={bar} />
                }

                <Drinkers
                  onSubmit={this.handleDrinkersSubmit}
                  onChange={this.handleDrinkersChange}
                />
              </Grid>
            </Grid>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
