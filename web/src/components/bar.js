import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  bar: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[100],
  },
});

const Bar = (props) => {
  const { classes, info } = props;
  return (
    <Paper className={classes.bar} elevation={0}>
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
  classes: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default withStyles(styles)(Bar);
