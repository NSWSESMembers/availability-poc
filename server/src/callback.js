import { Op } from 'sequelize';


const SESCallback = {
  creator: undefined,
  models: undefined,
  eventCallback(req, res) {
    const job = {
      name: `${req.body.JobType.Name} - ${req.body.Address.PrettyAddress}`,
      identifier: req.body.Identifier,
      description: req.body.JobType.Description,
      SituationOnScene: req.body.SituationOnScene,
      tags: req.body.Tags,
    };
    // look for a group with the LHQ name in it, or use group id:1
    this.models.Group.findOne({ where: { name: { [Op.like]: `%${req.body.EntityAssignedTo.Code}%` } } }).then(group => Promise.resolve(this.creator.event({
      name: job.name,
      details: `${job.SituationOnScene} [${job.tags.map(g => `#${g.Name}`).join(', ')}]`,
      identifier: job.identifier,
      permalink: `https://beacon.com/job/${job.identifier}`,
      group: group || { id: 1 },
    }).then(event => Promise.all(
      [
        this.creator.eventLocation({
          name: 'lhq',
          detail: req.body.EntityAssignedTo.Code,
          icon: 'lhq',
          locationLatitude: req.body.EntityAssignedTo.Latitude,
          locationLongitude: req.body.EntityAssignedTo.Longitude,
          primaryLocation: true,
          event,
        }),
        this.creator.eventLocation({
          name: 'scene',
          detail: req.body.Address.PrettyAddress,
          icon: 'scene',
          locationLatitude: req.body.Address.Latitude,
          locationLongitude: req.body.Address.Longitude,
          primaryLocation: false,
          event,
        }),
      ],
    )),
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

function getCallback(type, creator, models) {
  if (type === 'ses-hook') {
    SESCallback.creator = creator;
    SESCallback.models = models;

    return SESCallback.eventCallback.bind(SESCallback);
  }
  return null;
}

module.exports = { getCallback };
