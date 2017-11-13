import gql from 'graphql-tag';

export default gql`
  mutation updateLocation($loc: LocationUpdateInput!) {
    updateLocation(location: $loc)
  }
`;
