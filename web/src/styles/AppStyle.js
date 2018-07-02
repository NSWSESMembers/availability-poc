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
  paperHeader: {
    padding: 16,
    textAlign: 'left',
    color: theme.palette.text.secondary,
    overflowX: 'visible',
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
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
  chipType: {
    margin: theme.spacing.unit / 2,
    textAlign: 'left',
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
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
  radioButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    backgroundColor: '#EDEDED',
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
    backgroundColor: '#EDEDED',
  },
  tableCellCheckbox: {
    border: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
    textAlign: 'center',
  },
  tableCheckbox: {
    width: 24,
  },
  tableHighlight: {
    color: 'white',
    backgroundColor: theme.palette.alternate.main,
    margin: 0,
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 0,
    borderColor: '#E0E0E0',
  },
  tableStandard: {
    backgroundColor: '#EDEDED',
    margin: 0,
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    borderBottom: 0,
    borderColor: '#E0E0E0',
    borderStyle: 'solid',
  },
  tableNoHighlight: {
    margin: 0,
  },
});
