import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import isequal from 'lodash.isequal';
import empty from 'is-empty';
import bbox from '@turf/bbox';
import { point, featureCollection } from '@turf/helpers';

import Pin from './pin';
import geolocated from '../geolocated';
import { withCoordinates } from '../utils';

export default class Map extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const places = withCoordinates(props.places);

    // Only recalculate the viewport if coords are differents
    if (isequal(places, state.places)) {
      return null;
    }

    if (empty(places)) {
      return {
        places,
        viewport: {
          ...state.viewport,
          ...state.defaultViewport,
        },
      };
    }

    if (places.length === 1) {
      // Center the viewport on the only place
      const place = places[0];
      return {
        places,
        viewport: {
          ...state.viewport,
          latitude: place.coords.lat,
          longitude: place.coords.lng,
          zoom: 12,
        },
      };
    }

    // Resize the viewport to show all places
    const coords = featureCollection(
      places.map(place => point([place.coords.lng, place.coords.lat])),
    );

    const [minLng, minLat, maxLng, maxLat] = bbox(coords);
    const { viewport: currentViewport } = state;
    const viewport = new WebMercatorViewport(currentViewport);

    const { latitude, longitude, zoom } = viewport.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 30 },
    );

    return {
      places,
      viewport: {
        ...state.viewport,
        latitude,
        longitude,
        zoom,
      },
    };
  }

  constructor(props) {
    super(props);

    const defaultViewport = {
      latitude: props.viewportCoordinates[0],
      longitude: props.viewportCoordinates[1],
      zoom: props.viewportZoom,
    };

    this.state = {
      defaultViewport,
      viewport: {
        ...defaultViewport,
        width: '100%',
        height: 400,
        transitionDuration: 500,
      },
      places: withCoordinates(props.places),
    };
  }

  componentDidMount() {
    geolocated((position) => {
      // Update the default viewport coordinates
      const { latitude, longitude } = position.coords;
      this.setState(state => ({
        defaultViewport: {
          ...state.defaultViewport,
          latitude,
          longitude,
        },
      }));

      // Update the current position if the user is still in the default situation
      const { places } = this.state;
      if (places.length === 0) {
        this.setState(state => ({
          viewport: {
            ...state.viewport,
            latitude,
            longitude,
          },
        }));
      }
    });
  }

  render() {
    const { bar } = this.props;
    const { viewport, places } = this.state;

    return (
      <ReactMapGL
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        {...viewport}
        onViewportChange={vp => this.setState({ viewport: vp })}
      >
        {!empty(bar) && (
          <Marker
            longitude={bar.coordinates.longitude}
            latitude={bar.coordinates.latitude}
          >
            <Pin fill="#c00" />
          </Marker>
        )}
        {places.map(place => (
          <Marker
            key={place.uid}
            longitude={place.coords.lng}
            latitude={place.coords.lat}
          >
            <Pin />
          </Marker>
        ))}
      </ReactMapGL>
    );
  }
}

Map.propTypes = {
  bar: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  viewportCoordinates: PropTypes.array,
  viewportZoom: PropTypes.number,
};

Map.defaultProps = {
  viewportCoordinates: [48.852966, 2.349902],
  viewportZoom: 12,
};
