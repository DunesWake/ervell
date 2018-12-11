import gql from 'graphql-tag';

import userAvatarFragment from 'react/components/UserAvatar/fragments/userAvatar';

export default gql`
  fragment UserSelector on User {
    __typename
    id
    name
    hidden_email
    is_premium
    ...UserAvatar
  }
  ${userAvatarFragment}
`;
