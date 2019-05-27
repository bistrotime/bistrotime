import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import empty from 'is-empty';
import shortid from 'shortid';
import { withSnackbar } from 'notistack';

import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import BistrotimeLogo from './images/logo.svg';
import Place from './components/place';
import Bar from './components/bar';
import Map from './components/map';
import { withCoordinates } from './utils';

import './bistrotime.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      searching: false,
      bar: {},
      places: [],
    };

    this.addPlace = this.addPlace.bind(this);
    this.searchBar = this.searchBar.bind(this);
    this.onPlaceChange = this.onPlaceChange.bind(this);
    this.onPlaceClear = this.onPlaceClear.bind(this);
  }

  componentDidMount() {
    const { minNumberOfPlaces } = this.props;
    for (let i = 0; i < minNumberOfPlaces; i += 1) {
      this.addPlace();
    }
  }

  onPlaceChange(uid, event) {
    const places = this.updatePlaceCoordinates(uid, event.suggestion.latlng);

    this.setReadyState(places);
    this.setState({ places });
  }

  onPlaceClear(uid) {
    const places = this.updatePlaceCoordinates(uid, null);

    this.setReadyState(places);
    this.setState({ places });
  }

  setReadyState(places) {
    const { minNumberOfPlaces } = this.props;
    const placeWithCoords = withCoordinates(places);

    // Enable the button if we have enough coordinates
    if (placeWithCoords.length >= minNumberOfPlaces) {
      this.setState({ ready: true });
    } else {
      this.setState({ ready: false });
    }
  }

  addPlace() {
    this.setState(state => ({
      places: [
        ...state.places,
        {
          uid: shortid.generate(),
          coords: null,
        },
      ],
    }));
  }

  updatePlaceCoordinates(uid, coords) {
    const { places } = this.state;
    return places.map((place) => {
      if (place.uid === uid) {
        return {
          ...place,
          coords,
        };
      }

      return place;
    });
  }

  searchBar(event) {
    event.preventDefault();

    // Enable the LinearProgress
    this.setState({ searching: true });

    const { enqueueSnackbar } = this.props;
    const { places } = this.state;

    const coords = places
      .filter(place => place.coords)
      .map(place => `${place.coords.lat},${place.coords.lng}`);

    const qs = queryString.stringify({ coords });

    fetch(`${process.env.BISTROTIME_API_URL}/bar/find?${qs}`)
      .then(response => response.json())
      .then((data) => {
        if ('bar' in data && !empty(data.bar)) {
          this.setState({ bar: data.bar });
        } else if ('error' in data) {
          enqueueSnackbar(data.error.message, { variant: 'error' });
        } else {
          enqueueSnackbar('We are not able to find you a bar', { variant: 'warning' });
        }
      })
      .catch(() => {
        enqueueSnackbar('We have some issues right now, please retry later', { variant: 'error' });
      })
      .finally(() => {
        // Remove the LinearProgress
        this.setState({ searching: false });
      });
  }

  render() {
    const {
      bar,
      places,
      ready,
      searching,
    } = this.state;
    return (
      <main className="Container">
        <div className="Logo">
          <img
            src={BistrotimeLogo}
            alt="Bistrotime"
          />
        </div>
        <Map
          bar={bar}
          places={places}
        />
        <div className="Sidebar">
          {!empty(bar)
            && <Bar info={bar} />
          }
          <Paper elevation={0} className="Places">
            <form onSubmit={this.searchBar}>
              <Fab
                size="small"
                color="secondary"
                aria-label="Add"
                onClick={this.addPlace}
                className="AddPlace"
              >
                <AddIcon />
              </Fab>

              {places.map(place => (
                <Place
                  key={place.uid}
                  onChange={event => this.onPlaceChange(place.uid, event)}
                  onClear={() => this.onPlaceClear(place.uid)}
                />
              ))}
              <Button
                className="FindButton"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!ready || searching}
                fullWidth
              >
                Find me the best bar
                <LocalBarIcon className="BarIconButton" />
              </Button>
              {searching && (<LinearProgress className="Search" />)}
            </form>
          </Paper>
        </div>
        <Typography className="Footer">
          Made with
          <FavoriteIcon className="LoveIcon" />
          in France
        </Typography>
      </main>
    );
  }
}

App.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  minNumberOfPlaces: PropTypes.number,
};

App.defaultProps = {
  minNumberOfPlaces: 2,
};

export default withSnackbar(App);
