import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import isequal from 'lodash.isequal';
import empty from 'is-empty';
import bbox from '@turf/bbox';
import { point, featureCollection } from '@turf/helpers';
import { withSize } from 'react-sizeme';

import Typography from '@material-ui/core/Typography';

import Pin from './pin';
import geolocated from '../geolocated';
import { withCoordinates } from '../utils';

import './map.scss';

class Map extends React.Component {
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
      { padding: 150 },
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
    const { bar, size } = this.props;
    const { viewport, places } = this.state;

    return (
      <div className="MapContainer">
        <ReactMapGL
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          {...viewport}
          width={size.width}
          height={size.height}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={vp => this.setState({ viewport: vp })}
        >
          {places.map(place => (
            <Marker
              key={place.uid}
              longitude={place.coords.lng}
              latitude={place.coords.lat}
            >
              <Pin />
            </Marker>
          ))}
          {!empty(bar) && (
            <React.Fragment>
              <Marker
                longitude={bar.coordinates.longitude}
                latitude={bar.coordinates.latitude}
              >
                <Pin fill="#c00" />
              </Marker>
              <Popup
                anchor="top"
                longitude={bar.coordinates.longitude}
                latitude={bar.coordinates.latitude}
                closeButton={false}
              >
                <div className="Bar">
                  <Typography variant="h6" gutterBottom>
                    {bar.name}
                  </Typography>

                  {bar.location.display_address.map(line => (
                    <Typography key={line} variant="body2">
                      {line}
                    </Typography>
                  ))}
                </div>
              </Popup>
            </React.Fragment>
          )}
        </ReactMapGL>
      </div>
    );
  }
}

Map.propTypes = {
  bar: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  viewportCoordinates: PropTypes.array,
  viewportZoom: PropTypes.number,
  size: PropTypes.object.isRequired,
};

Map.defaultProps = {
  viewportCoordinates: [48.852966, 2.349902],
  viewportZoom: 12,
};

export default withSize({ monitorHeight: true })(Map);
