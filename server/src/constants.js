export const DISTANT_FUTURE = 2147483647;
export const DISTANT_PAST = 0;

export const PUBSUBS = {
  MESSAGE: {
    CREATED: 'MESSAGE_CREATED',
  },
  EVENTRESPONSE: {
    // Use Updated for CREATED and UPDATED as thats how we treat them in the logic
    UPDATED: 'EVENTRESPONSE_UPDATED',
  },
  EVENT: {
    CREATED: 'EVENT_CREATED',
    UPDATED: 'EVENT_UPDATED',
  },
};
