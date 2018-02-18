function eventCallback(req, res) {
  // check auth
  if (req.header('Bearer')) {
    console.log(req.header('Bearer'));
    console.log(req.header('Authorization'));
  }

  console.log(req.body);

  // get the base handler to add the event
  // send notifications (probably belongs in the other code)
  res.send('OK');
}

function getCallback(type) {
  if (type === 'ses-hook') {
    return eventCallback;
  }
  return null;
}

module.exports = { getCallback };
