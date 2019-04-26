import React from 'react';
import PropTypes from 'prop-types';
import AlgoliaPlaces from 'places.js';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  '@global': {
    '.algolia-places': {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      marginTop: theme.spacing.unit,
    },
  },
});

class Place extends React.Component {
  componentDidMount() {
    this.places = AlgoliaPlaces({
      appId: process.env.ALGOLIA_PLACES_APP_ID,
      apiKey: process.env.ALGOLIA_PLACES_APP_KEY,
      container: this.autocompleteElem,
    });

    const { onChange } = this.props;
    if (onChange) {
      this.places.on('change', onChange);
    }
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
  onChange: null,
};

Place.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default withStyles(styles)(Place);
