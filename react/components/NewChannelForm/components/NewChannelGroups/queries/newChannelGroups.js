import gql from 'graphql-tag';

import newChannelGroupsFragment from 'react/components/NewChannelForm/components/NewChannelGroups/fragments/newChannelGroups';

export default gql`
  query NewChannelGroupsQuery {
    me {
      ...NewChannelGroups
    }
  }
  ${newChannelGroupsFragment}
`;
