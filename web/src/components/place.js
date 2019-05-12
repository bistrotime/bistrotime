import React from 'react';
import PropTypes from 'prop-types';
import AlgoliaPlaces from 'places.js';

import './place.scss';

class Place extends React.PureComponent {
  componentDidMount() {
    this.places = AlgoliaPlaces({
      appId: process.env.ALGOLIA_PLACES_APP_ID,
      apiKey: process.env.ALGOLIA_PLACES_APP_KEY,
      container: this.autocompleteElem,
    });

    this.places.configure({
      type: 'address',
    });

    const { onChange, onClear } = this.props;
    this.places.on('change', onChange);
    this.places.on('clear', onClear);
  }

  render() {
    const { placeholder } = this.props;
    return (
      <div>
        <input
          type="text"
          placeholder={placeholder}
          ref={(ref) => { this.autocompleteElem = ref; }}
        />
      </div>
    );
  }
}

Place.defaultProps = {
  placeholder: 'Type an address',
};

Place.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default Place;
