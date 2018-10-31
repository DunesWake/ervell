import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { without } from 'underscore';

import currentUserService from 'react/util/currentUserService';

import TitledDialog from 'react/components/UI/TitledDialog';
import CollaboratorSearch from 'react/components/CollaboratorSearch';
import PendingGroupUsers from 'react/components/CreateGroup/components/PendingGroupUsers';
import CancelButton from 'react/components/CreateGroup/components/CancelButton';
import HelpTip from 'react/components/CreateGroup/components/HelpTip';
import { LabelledInput, Label, Input } from 'react/components/UI/Inputs';

import createGroupMutation from 'react/components/CreateGroup/mutations/createGroup';
import addChannelMemberMutation from 'react/components/CreateGroup/mutations/addChannelMember';
import addGroupUsersMutation from 'react/components/CreateGroup/mutations/addGroupUsers';
import inviteUserMutation from 'react/components/CreateGroup/mutations/inviteUser';

class CreateGroup extends Component {
  static propTypes = {
    channel_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func.isRequired,
    createGroup: PropTypes.func.isRequired,
    addChannelMember: PropTypes.func.isRequired,
    addGroupUsers: PropTypes.func.isRequired,
    inviteUser: PropTypes.func.isRequired,
  }

  static defaultProps = {
    channel_id: null,
  }

  state = {
    mode: 'resting',
    name: '',
    user_ids: [currentUserService().id],
  }

  handleName = ({ target: { value: name } }) => {
    const isEdited = name !== '';

    this.setState({
      name,
      mode: isEdited ? 'submit' : 'resting',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const {
      channel_id, onClose, createGroup, addChannelMember, addGroupUsers,
    } = this.props;

    const { mode, name, user_ids } = this.state;

    if (mode === 'resting') return onClose();

    this.setState({ mode: 'submitting' });

    // Create the group
    return createGroup({ variables: { name } })
      // Add users to the Group
      .then(({ data: { create_group: { group: { id, href } } } }) => {
        if (user_ids.length === 0) return Promise.resolve();

        return addGroupUsers({
          variables: {
            id,
            user_ids,
          },
        })
          .then(() => {
            // If there's no channel context then redirect to the new group
            if (!channel_id) {
              window.location = href;
              return Promise.resolve();
            }

            // Pass along the group id
            return id;
          });
      })

      // Add the group to the channel if a `channel_id` is present
      .then((member_id) => {
        if (!channel_id) return Promise.resolve();

        return addChannelMember({
          variables: {
            channel_id,
            member_id,
            member_type: 'GROUP',
          },
        });
      })

      // Close it out
      .then(onClose)
      .catch((err) => {
        console.error(err);
        // TODO: Better error handling
        this.setState({ mode: 'error' });
      });
  }

  addUserId = user_id =>
    new Promise(resolve =>
      this.setState((prevState) => {
        const user_ids = [...new Set([...prevState.user_ids, user_id])];
        return { user_ids };
      }, resolve));

  handleAddUser = ({ member_id: user_id }) =>
    this.addUserId(user_id);

  handleInviteUser = ({ email }) => {
    const { inviteUser } = this.props;

    return inviteUser({ variables: { email } })
      .then(({ data: { invite_users: { users } } }) => {
        const { id: user_id } = users[0];
        return this.addUserId(user_id);
      });
  }

  removeUserId = id =>
    this.setState(({ user_ids }) => ({
      user_ids: without(user_ids, id),
    }));

  render() {
    const { mode, name, user_ids } = this.state;
    const { channel_id, onClose } = this.props;

    return (
      <TitledDialog
        title="Create group"
        label={{
          resting: 'Done',
          submit: 'Save',
          submitting: 'Saving...',
          error: 'Error',
        }[mode]}
        onDone={this.handleSubmit}
      >
        {mode !== 'resting' &&
          <CancelButton onClick={onClose} />
        }

        <LabelledInput>
          <Label>
            Name
          </Label>

          <Input
            name="name"
            placeholder="enter group name"
            onChange={this.handleName}
            value={name}
          />
        </LabelledInput>

        <LabelledInput>
          <Label>
            Invite
          </Label>

          <CollaboratorSearch
            types={['USER']}
            onAdd={this.handleAddUser}
            onInvite={this.handleInviteUser}
            channel_id={channel_id}
          />
        </LabelledInput>

        {user_ids.length > 0 &&
          <LabelledInput>
            <Label>
              Members
            </Label>

            <PendingGroupUsers
              user_ids={user_ids}
              onRemove={this.removeUserId}
            />
          </LabelledInput>
        }

        <HelpTip />
      </TitledDialog>
    );
  }
}

export default compose(
  graphql(createGroupMutation, { name: 'createGroup' }),
  graphql(addChannelMemberMutation, { name: 'addChannelMember' }),
  graphql(addGroupUsersMutation, { name: 'addGroupUsers' }),
  graphql(inviteUserMutation, { name: 'inviteUser' }),
)(CreateGroup);
