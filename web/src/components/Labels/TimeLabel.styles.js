const avatar = {
  minWidth: 0,
  width: '100%',
  color: 'white',
  paddingLeft: 8,
  paddingRight: 8,
};

export default () => ({
  avatarAV: {
    backgroundColor: 'green',
    ...avatar,
  },
  avatarUN: {
    backgroundColor: 'red',
    ...avatar,
  },
  avatarUR: {
    backgroundColor: 'purple',
    ...avatar,
  },
  avatarMargin: {
    marginLeft: 3,
    marginRight: 3,
  },
});
