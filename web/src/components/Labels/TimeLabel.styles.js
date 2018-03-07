const avatar = {
  color: 'white',
  margin: 0,
  marginRight: 3,
  width: 30,
  height: 30,
  fontSize: 16,
  cursor: 'pointer',
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
});

