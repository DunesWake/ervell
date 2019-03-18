import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import modalBlockLightboxQuery from 'react/components/ModalBlockLightbox/queries/modalBlockLightbox';

import Box from 'react/components/UI/Box';
import Close from 'react/components/UI/Close';
import ErrorAlert from 'react/components/UI/ErrorAlert';
import LoadingIndicator from 'react/components/UI/LoadingIndicator';
import BlockLightbox from 'react/components/BlockLightbox';
import ModalBlockLightboxNavigation from 'react/components/ModalBlockLightbox/components/ModalBlockLightboxNavigation';

export default class ModalBlockLightbox extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    ids: PropTypes.arrayOf(PropTypes.number),
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ids: [],
  }

  state = {
    id: this.props.id,
  }

  updateId = id =>
    this.setState({ id });

  render() {
    const { id } = this.state;
    const { ids, onClose } = this.props;

    return (
      <Box position="relative" width="100%" height="100%">
        <Close
          position="absolute"
          size={7}
          p={5}
          thickness="4px"
          top="0"
          right="0"
          onClick={onClose}
        />

        <Query query={modalBlockLightboxQuery} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading) {
              return <LoadingIndicator />;
            }

            if (error) {
              return (
                <ErrorAlert>
                  {error.message}
                </ErrorAlert>
              );
            }

            const { block } = data;

            return (
              <BlockLightbox block={block} context="MODAL">
                <ModalBlockLightboxNavigation
                  id={id}
                  ids={ids}
                  position="absolute"
                  top="50%"
                  left="50%"
                  bg="white"
                  zIndex="1"
                  onChange={this.updateId}
                />
              </BlockLightbox>
            );
          }}
        </Query>
      </Box>
    );
  }
}
