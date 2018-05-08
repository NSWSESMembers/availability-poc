import gql from 'graphql-tag';

export default gql`
  mutation updateEvent($event: UpdateEventInput!) {
    updateEvent(event: $event) {
      id
      name
      details
      sourceIdentifier
      permalink
    }
  }
`;
