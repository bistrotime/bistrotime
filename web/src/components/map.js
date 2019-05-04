import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import empty from 'is-empty';

import Pin from './pin';
import geolocated from '../geolocated';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: '100%',
        height: '60vh',
        latitude: props.viewportCoordinates[0],
        longitude: props.viewportCoordinates[1],
        zoom: props.viewportZoom,
      },
    };
  }

  componentDidMount() {
    geolocated((position) => {
      // Update the viewport with the user location
      const { latitude, longitude } = position.coords;
      this.setState(state => ({
        viewport: {
          ...state.viewport,
          latitude,
          longitude,
        },
      }));
    });
  }

  render() {
    const { bar, places } = this.props;
    const { viewport } = this.state;
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
