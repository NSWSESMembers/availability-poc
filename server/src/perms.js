export const schedulePerms = {
  userWantsToRead({ user: userPromise, schedule: schedulePromise }) {
    // TODO: decide whether to allow users who are not a member of the group the schedule is for to
    // see it
    return Promise.all([
      userPromise,
      schedulePromise,
    ]).then(([user, schedule]) => {
      if (!user) {
        return Promise.reject(Error('Invalid user'));
      }
      if (!schedule) {
        return Promise.reject(Error('Invalid schedule'));
      }

      return Promise.resolve(schedule.getGroup()).then((group) => {
        if (!group) {
          return Promise.reject(Error('Invalid group'));
        }

        if (user.organisationId !== group.organisationId) {
          return Promise.reject(
            Error('Permission denied - this schedule isnt part of your organisation'),
          );
        }

        return schedule;
      });
    });
  },
};

export const eventPerms = {
  userWantsToRead({ user: userPromise, event: eventPromise }) {
    // TODO: decide whether to allow users who are not a member of the group the event is for to
    // see it
    return Promise.all([
      userPromise,
      eventPromise,
    ]).then(([user, event]) => {
      if (user === null) {
        return Promise.reject(Error('Invalid user'));
      }
      if (event === null) {
        return Promise.reject(Error('Invalid event'));
      }

      return Promise.resolve(event.getGroup()).then((group) => {
        if (!group) {
          return Promise.reject(Error('Invalid group'));
        }

        if (user.organisationId !== group.organisationId) {
          return Promise.reject(
            Error('Permission denied - this event isnt part of your organisation'),
          );
        }

        return { event, user };
      });
    });
  },
  userWantsToWrite(args) {
    return this.userWantsToRead(args);
  },
};
