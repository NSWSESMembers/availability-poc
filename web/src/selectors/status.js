export default (status) => {
  switch (status) {
    case 'Available':
      return 'AV';
    case 'Unavailable':
      return 'UN';
    case 'Unavailable - unless urgent':
      return 'UR';
    default:
      return 'AV';
  }
};
