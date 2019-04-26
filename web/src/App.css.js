export default theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  logo: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  grid: {
    marginTop: theme.spacing.unit * 3,
  },
  places: {
    padding: theme.spacing.unit * 2,
    backgroundColor: theme.palette.grey[200],
  },
  findButton: {
    marginTop: theme.spacing.unit * 2,
  },
  barIconButton: {
    marginLeft: theme.spacing.unit,
  },
  addPlaceFab: {
    marginBottom: theme.spacing.unit,
    float: 'right',
  },
});
