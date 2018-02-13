const isDev = () => {
  const hostname = window && window.location && window.location.hostname;
  if (hostname === 'localhost') {
    return true;
  }
  return false;
};

export default isDev;
