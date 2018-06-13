import { Op } from 'sequelize';

const SESCallback = {
  creator: undefined,
  models: undefined,
  push: undefined,
  eventCallback(req, res) {
    const job = {
      name: `${req.body.SimpleJobViewModel.JobType.Name} - ${req.body.SimpleJobViewModel.Address.PrettyAddress}`,
      identifier: req.body.SimpleJobViewModel.Identifier,
      description: req.body.SimpleJobViewModel.JobType.Description,
      SituationOnScene: req.body.SimpleJobViewModel.SituationOnScene,
      tags: req.body.SimpleJobViewModel.Tags,
    };
    // look for a group with the LHQ name in it, or use group id:1
    this.models.Group.findOne({
      where: {
        name: {
          [Op.like]: `%${req.body.SimpleJobViewModel.EntityAssignedTo.Code}%`,
        },
      },
    }).then(group => Promise.resolve(this.creator.event({
      name: job.name,
      details: `${job.SituationOnScene || ''}${job.SituationOnScene ? ' ' : ''}[${job.tags.map(g => `#${g.Name}`).join(', ')}]`,
      sourceIdentifier: job.identifier,
      permalink: `https://beacon.com/job/${job.identifier}`,
      group: group || { id: 1 },
    }).then((event) => {
      Promise.all(
        [
          this.creator.eventLocation({
            name: 'lhq',
            detail: req.body.SimpleJobViewModel.EntityAssignedTo.Code,
            icon: 'mci-castle',
            locationLatitude: req.body.SimpleJobViewModel.EntityAssignedTo.Latitude,
            locationLongitude: req.body.SimpleJobViewModel.EntityAssignedTo.Longitude,
            primaryLocation: true,
            event,
          }),
          this.creator.eventLocation({
            name: 'scene',
            detail: req.body.SimpleJobViewModel.Address.PrettyAddress,
            icon: 'mci-target',
            locationLatitude: req.body.SimpleJobViewModel.Address.Latitude,
            locationLongitude: req.body.SimpleJobViewModel.Address.Longitude,
            primaryLocation: false,
            event,
          }),
        ],

      ).then(() => {
        this.push.pushEventToGroup(event);
      });
    }),
    )).then(() => {
      const result = {
        status: 'OK',
      };
      res.send(JSON.stringify(result));
    }).catch(() => {
      const result = {
        status: 'FAIL',
      };
      res.send(JSON.stringify(result));
    });


    // get the base handler to add the event
    // send notifications (probably belongs in the other code)
  },
};

function getCallback(type, creator, models, push) {
  if (type === 'ses-hook') {
    SESCallback.creator = creator;
    SESCallback.models = models;
    SESCallback.push = push;

    return SESCallback.eventCallback.bind(SESCallback);
  }
  return null;
}

module.exports = { getCallback };
