import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './bar.scss';

const Bar = (props) => {
  const { info } = props;
  return (
    <Paper className="Bar" elevation={0}>
      <Typography variant="h6" gutterBottom>
        {info.name}
      </Typography>

      {info.location.display_address.map(line => (
        <Typography key={line} component="p">
          {line}
        </Typography>
      ))}
    </Paper>
  );
};

Bar.propTypes = {
  info: PropTypes.object.isRequired,
};

export default Bar;
