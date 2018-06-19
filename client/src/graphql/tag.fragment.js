import gql from 'graphql-tag';


const TAG_FRAGMENT = gql`
  fragment TagFragment on Tag {
    id
    name
    type
  }
`;

export default TAG_FRAGMENT;
