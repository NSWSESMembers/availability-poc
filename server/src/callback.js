const SESCallback = {
  creator: undefined,
  eventCallback(req, res) {
    const job = {
      name: req.body.JobType.Name,
      identifier: req.body.Identifier,
      description: req.body.JobType.Description,
    };

    Promise.resolve(this.creator.location({
      name: 'scene',
      detail: req.body.Address.PrettyAddress,
      locationLatitude: req.body.Address.Latitude,
      locationLongitude: req.body.Address.Longitude,
    }).then(eventLocation => this.creator.event({
      name: job.name,
      description: job.description,
      identifier: job.identifier,
      permalink: `https://beacon.com/job/${job.identifier}`,
      location: eventLocation,
      group: { id: 1 },
    })));

    // get the base handler to add the event
    // send notifications (probably belongs in the other code)
    res.send('OK');
  },
};

function getCallback(type, creator) {
  if (type === 'ses-hook') {
    SESCallback.creator = creator;
    console.log(SESCallback.creator);
    return SESCallback.eventCallback.bind(SESCallback);
  }
  return null;
}

module.exports = { getCallback };
