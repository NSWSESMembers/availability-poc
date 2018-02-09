import { schedulePerms, eventPerms } from '../perms';

describe('Schedule permissions', () => {
  describe('allowed', () => {
    const user = {
      organisationId: 69,
    };
    const schedule = {
      getGroup: () => ({
        organisationId: 69,
      }),
    };

    it('with no promises', () =>
      expect(schedulePerms.userWantsToRead({ user, schedule }))
        .resolves.toBe(schedule),
    );

    it('with promises', () =>
      expect(schedulePerms.userWantsToRead({
        user: Promise.resolve(user),
        schedule: Promise.resolve(schedule),
      }))
        .resolves.toBe(schedule),
    );
  });

  describe('denied', () => {
    it('wrong org', () => {
      const user = {
        organisationId: 69,
      };
      const schedule = {
        getGroup: () => ({
          organisationId: 1,
        }),
      };

      return expect(schedulePerms.userWantsToRead({ user, schedule }))
        .rejects.toThrow();
    });

    it('invalid group', () => {
      const user = {
        organisationId: 69,
      };
      const schedule = {
        getGroup: () => null,
      };

      return expect(schedulePerms.userWantsToRead({ user, schedule }))
        .rejects.toThrow();
    });

    it('invalid user', () => {
      const schedule = {
        getGroup: () => ({
          organisationId: 1,
        }),
      };

      return expect(schedulePerms.userWantsToRead({ user: null, schedule }))
        .rejects.toThrow();
    });

    it('invalid schedule', () => {
      const user = {
        organisationId: 69,
      };

      return expect(schedulePerms.userWantsToRead({ user, schedule: null }))
        .rejects.toThrow();
    });
  });
});

describe('Event permissions', () => {
  describe('allowed', () => {
    const user = {
      organisationId: 69,
    };
    const event = {
      getGroup: () => ({
        organisationId: 69,
      }),
    };

    it('with no promises', () =>
      expect(eventPerms.userWantsToRead({ user, event }))
        .resolves.toMatchObject({ event, user }),
    );

    it('with promises', () =>
      expect(eventPerms.userWantsToRead({
        user: Promise.resolve(user),
        event: Promise.resolve(event),
      }))
        .resolves.toMatchObject({ event, user }),
    );
  });

  describe('denied', () => {
    it('wrong org', () => {
      const user = {
        organisationId: 69,
      };
      const event = {
        getGroup: () => ({
          organisationId: 1,
        }),
      };

      return expect(eventPerms.userWantsToRead({ user, event }))
        .rejects.toThrow();
    });

    it('invalid group', () => {
      const user = {
        organisationId: 69,
      };
      const event = {
        getGroup: () => null,
      };

      return expect(eventPerms.userWantsToRead({ user, event }))
        .rejects.toThrow();
    });

    it('invalid user', () => {
      const event = {
        getGroup: () => ({
          organisationId: 1,
        }),
      };

      return expect(eventPerms.userWantsToRead({ user: null, event }))
        .rejects.toThrow();
    });

    it('invalid event', () => {
      const user = {
        organisationId: 69,
      };

      return expect(eventPerms.userWantsToRead({ user, event: null }))
        .rejects.toThrow();
    });
  });
});
