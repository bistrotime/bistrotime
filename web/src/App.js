import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import queryString from 'query-string';
import empty from 'is-empty';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

import Drinkers from './components/drinkers';
import Pin from './components/pin';
import Bar from './components/bar';
import BistrotimeLogo from './images/logo.svg';

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
  logo: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
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

    fetch(`${process.env.BISTROTIME_API_URL}/finder?${qs}`)
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
            <img
              className={classes.logo}
              src={BistrotimeLogo}
              alt="Bistrotime"
            />
          </Toolbar>
          <main>
            <Grid container spacing={40} className={classes.grid}>
              <Grid item xs={12} md={8}>
                <ReactMapGL
                  mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
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
