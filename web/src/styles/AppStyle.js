export default theme => ({
  root: {
    margin: 30,
  },
  actionPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  actionContainer: {
    padding: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  paper: {
    padding: 16,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    overflowX: 'visible',
    minWidth: 720,
  },
  paperForm: {
    padding: 16,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    overflowX: 'visible',
    maxWidth: 720,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 700,
  },
  tableToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 40,
  },
  tableCell: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    minWidth: 275,
  },
  cardContent: {
    width: 760,
  },
  cardIcon: {},
  cardTitle: {
    marginLeft: 10,
  },
  cardInputs: {
    marginLeft: 40,
  },
  cardActions: {
    paddingLeft: 12,
    marginLeft: 46,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: 300,
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
  },
  formControlFilter: {
    margin: theme.spacing.unit,
    width: 220,
  },
  menu: {
    width: 200,
  },
  chip: {
    margin: theme.spacing.unit / 2,
    textAlign: 'left',
  },
});
