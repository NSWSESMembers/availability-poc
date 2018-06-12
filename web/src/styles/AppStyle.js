export default theme => ({
  root: {
    margin: 30,
  },
  actionPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  actionContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'flex-start',
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
  paperMargin: {
    padding: 16,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    overflowX: 'visible',
    minWidth: 720,
    marginTop: 16,
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
  button: {
    margin: theme.spacing.unit,
  },
  buttonSmall: {
    margin: theme.spacing.unit,
    height: 24,
  },
  buttonIcon: {
    padding: 0,
  },
  tableCellHeader: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    padding: 0,
  },
  tableCellHeaderDisabled: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    padding: 0,
    backgroundColor: '#CCC',
    color: 'white',
  },
  tableCellHeaderFirst: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
  },
  tableCellFirst: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
  },
  tableCellDisabled: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    backgroundColor: '#CCC',
  },
});
