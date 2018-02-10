import { GO_TO_EVENT, GO_TO_REQUEST } from '../state/constants';

export const goToEvent = id => ({
  type: GO_TO_EVENT,
  id,
});

export const goToRequest = id => ({
  type: GO_TO_REQUEST,
  id,
});
