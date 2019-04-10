import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import LocalBarIcon from '@material-ui/icons/LocalBar';

const styles = theme => ({
  drinkers: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200],
  },
  findButton: {
    marginTop: theme.spacing.unit,
  },
  barIconButton: {
    marginLeft: theme.spacing.unit,
  },
});

class Drinkers extends React.Component {
  state = {
    coords: [
      '48.850639,2.401598',
      '48.884590,2.304898',
    ],
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange = idx => (evt) => {
    const { coords } = this.state;
    const { onChange } = this.props;

    coords[idx] = evt.target.value;

    this.setState({ coords });
    onChange(coords);
  };

  handleClick() {
    this.setState(prevState => ({ coords: [...prevState.coords, ''] }));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { coords } = this.state;
    const { onSubmit } = this.props;

    onSubmit(coords);
  }

  render() {
    const { classes } = this.props;
    const { coords } = this.state;

    return (
      <Paper elevation={0} className={classes.drinkers}>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            onClick={this.handleClick}
            style={{ float: 'right' }}
          >
            <AddIcon />
          </Fab>
          <Typography variant="h6" gutterBottom>
            Drinkers
          </Typography>

          {coords.map(coord => (
            <TextField
              key={coord.id}
              name="coords"
              label="Coordinate"
              fullWidth
              margin="normal"
              value={coord}
              onChange={this.handleChange(coord.id)}
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
    );
  }
}

Drinkers.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(Drinkers);
