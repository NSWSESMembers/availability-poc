import gql from 'graphql-tag';

export default gql`
  mutation createEvent($event: CreateEventInput!) {
    createEvent(event: $event) {
      id
      name
      details
      sourceIdentifier
      permalink
    }
  }
`;
