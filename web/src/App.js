import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import queryString from 'query-string';
import empty from 'is-empty';
import shortid from 'shortid';
import { withSnackbar } from 'notistack';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import Button from '@material-ui/core/Button';

import Place from './components/place';
import Pin from './components/pin';
import Bar from './components/bar';
import BistrotimeLogo from './images/logo.svg';

import Style from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: '100%',
        height: '60vh',
        latitude: 48.863066,
        longitude: 2.328776,
        zoom: 12,
      },
      bar: {},
      places: [],
    };

    this.addPlace = this.addPlace.bind(this);
    this.onPlaceHasAddress = this.onPlaceHasAddress.bind(this);
    this.findBar = this.findBar.bind(this);
  }

  componentDidMount() {
    const { initialNumberOfPlaces } = this.props;
    for (let i = 0; i < initialNumberOfPlaces; i += 1) {
      this.addPlace();
    }
  }

  onPlaceHasAddress(uid, event) {
    const { places } = this.state;

    const placeIndex = places.findIndex(x => x.uid === uid);
    places[placeIndex].coords = event.suggestion.latlng;

    this.setState({ places });
  }

  findBar(event) {
    event.preventDefault();
    const { enqueueSnackbar } = this.props;
    const { places } = this.state;
    const coords = places
      .filter(place => place.coords)
      .map(place => `${place.coords.lat},${place.coords.lng}`);

    const qs = queryString.stringify({ coords });

    fetch(`${process.env.BISTROTIME_API_URL}/finder?${qs}`)
      .then(response => response.json())
      .then((data) => {
        if (empty(data.bar)) {
          enqueueSnackbar('Mmh.. we are not able to find you a bar, sorry!', { variant: 'warning' });
        } else {
          this.setState({ bar: data.bar[0] });
        }
      }).catch(() => {
        enqueueSnackbar('We have some issues right now, please retry later', { variant: 'error' });
      });
  }

  addPlace() {
    this.setState(prevState => ({
      places: [
        ...prevState.places,
        {
          uid: shortid.generate(),
          coords: null,
        },
      ],
    }));
  }

  render() {
    const { classes } = this.props;
    const { viewport, bar, places } = this.state;
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
                  {places.map(place => place.coords && (
                    <Marker
                      key={place.uid}
                      longitude={place.coords.lng}
                      latitude={place.coords.lat}
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

                <Paper elevation={0} className={classes.places}>
                  <form onSubmit={this.findBar}>
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="Add"
                      onClick={this.addPlace}
                      className={classes.addPlaceFab}
                    >
                      <AddIcon />
                    </Fab>

                    {places.map(place => (
                      <Place
                        key={place.uid}
                        onChange={event => this.onPlaceHasAddress(place.uid, event)}
                      />
                    ))}

                    <Button
                      className={classes.findButton}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Find me the best bar
                      <LocalBarIcon className={classes.barIconButton} />
                    </Button>
                  </form>
                </Paper>
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
  enqueueSnackbar: PropTypes.func.isRequired,
  initialNumberOfPlaces: PropTypes.number,
};

App.defaultProps = {
  initialNumberOfPlaces: 2,
};

export default withSnackbar(withStyles(Style)(App));
