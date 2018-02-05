import { getCreators } from '../creators';
import { defineModels } from '../models-mock';

const models = defineModels();
const creators = getCreators(models);

describe('create organisation', () => {
  it('returns an object', async () => {
    const name = 'test org';
    const result = await creators.organisation({ name });
    expect(result.name).toBe(name);
    expect(result.id).toBeDefined();
  });
});

describe('create schedule', () => {
  const name = 'test schedule';
  const group = { id: 45965 };
  const startTime = 1514854818;
  const endTime = 1514854818 + (60 * 60);

  it('rejects due to missing group', async () => {
    await expect(creators.schedule({})).rejects.toThrow();
  });

  it('rejects due to missing start/end time', async () => {
    await expect(creators.schedule({ group })).rejects.toThrow();
  });

  it('returns a schedule', async () => {
    const result = await creators.schedule({
      name, group, startTime, endTime,
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe(name);
    expect(result.groupId).toBe(group.id);
  });
});

describe('create event', () => {
  const name = 'test event';
  const details = 'test event details';
  const group = { id: 34556 };

  it('rejects due to missing group', async () => {
    await expect(creators.event({})).rejects.toThrow();
  });

  it('returns an event', async () => {
    const result = await creators.event({
      name, details, group,
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe(name);
    expect(result.groupId).toBe(group.id);
  });
});

describe('create tag', () => {
  const name = 'test';
  const group = { id: 34556 };
  const user = { id: 548746 };
  const organisation = { id: 1248 };

  it('rejects due to missing user', async () => {
    await expect(creators.tag({})).rejects.toThrow();
  });

  it('rejects due to missing group', async () => {
    await expect(creators.tag({ user })).rejects.toThrow();
  });

  it('rejects due to missing organisation', async () => {
    await expect(creators.tag({ user, group })).rejects.toThrow();
  });

  it('returns a tag', async () => {
    const result = await creators.tag({ name, user, group, organisation });

    expect(result.id).toBeDefined();
    expect(result.name).toBe(name);
    expect(result.organisationId).toBe(organisation.id);
  });
});

describe('create capability', () => {
  const name = 'test';
  const user = { id: 548746 };
  const organisation = { id: 1248 };

  it('rejects due to missing organisation', async () => {
    await expect(creators.capability({})).rejects.toThrow();
  });

  it('rejects due to missing user', async () => {
    await expect(creators.capability({ organisation })).rejects.toThrow();
  });

  it('returns a capability', async () => {
    const result = await creators.capability({ name, organisation, user });

    // this returns the user rather than the capability which isn't ideal
    // but lets test for it for now
    expect(result.id).toBe(user.id);
  });
});

describe('create device', () => {
  const user = { id: 548746 };
  const uuid = '123455abc';

  it('rejects due to missing user', async () => {
    await expect(creators.device({})).rejects.toThrow();
  });

  it('returns a device', async () => {
    const result = await creators.device({ user, uuid });

    expect(result.id).toBeDefined();
    expect(result.uuid).toBe(uuid);
    expect(result.userId).toBe(user.id);
  });
});

describe('create group', () => {
  const name = 'test group';
  const organisation = { id: 12346 };
  const user = { id: 548746 };

  it('rejects due to missing organisation', async () => {
    await expect(creators.group({})).rejects.toThrow();
  });

  it('rejects due to missing user', async () => {
    await expect(creators.group({ organisation })).rejects.toThrow();
  });

  it('returns a group', async () => {
    const result = await creators.group({ organisation, name, users: [user] });

    expect(result.id).toBeDefined();
    expect(result.organisationId).toBe(organisation.id);
  });
});

describe('create user', () => {
  const username = 'username';
  const password = 'password';
  const email = 'test@example.com';
  const organisation = { id: 12346 };

  it('rejects due to missing organisation', async () => {
    await expect(creators.user({})).rejects.toThrow();
  });

  it('returns a user', async () => {
    const result = await creators.user({ username, password, email, version: 1, organisation });

    expect(result.id).toBeDefined();
    expect(result.username).toBe(username);
    expect(result.password).toBeDefined();
    expect(result.email).toBe(email);
    expect(result.organisationId).toBe(organisation.id);
  });
});

describe('create timeSegment', () => {
  const status = 'test';
  const startTime = 1514854818;
  const endTime = 1514854818 + (60 * 60);
  const schedule = { id: 12346 };
  const user = { id: 134569 };

  it('rejects due to missing user', async () => {
    await expect(creators.timeSegment({})).rejects.toThrow();
  });

  it('rejects due to missing schedule', async () => {
    await expect(creators.timeSegment({ user })).rejects.toThrow();
  });

  it('rejects due to missing startTime', async () => {
    await expect(creators.timeSegment({ user, schedule })).rejects.toThrow();
  });

  it('returns a timeSegment', async () => {
    const result = await creators.timeSegment({ status, startTime, endTime, schedule, user });

    expect(result.id).toBeDefined();
    expect(result.status).toBe(status);
    expect(result.scheduleId).toBe(schedule.id);
    expect(result.userId).toBe(user.id);
  });
});

describe('create eventResponse', () => {
  const status = 'test';
  const event = { id: 123895 };
  const user = { id: 134569 };

  it('rejects due to missing user', async () => {
    await expect(creators.eventResponse({})).rejects.toThrow();
  });

  it('rejects due to missing event', async () => {
    await expect(creators.eventResponse({ user })).rejects.toThrow();
  });

  it('returns a timeSegment', async () => {
    const result = await creators.eventResponse({ status, event, user });

    expect(result.id).toBeDefined();
    expect(result.status).toBe(status);
    expect(result.eventId).toBe(event.id);
    expect(result.userId).toBe(user.id);
  });
});
