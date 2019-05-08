/* eslint-disable react/forbid-prop-types */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import Truncate from 'v2/components/UI/Truncate'
import Box from 'v2/components/UI/Box'
import Text from 'v2/components/UI/Text'
import { FilledButton } from 'v2/components/UI/Buttons'

const Container = styled(Box).attrs({
  m: 4,
})`
  display: flex;
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid ${props => props.theme.colors.gray.semiLight};
`

const TextContainer = styled(Box).attrs({ p: 3 })`
  min-width: 100%;
  text-align: left;
  display: flex;
  position: relative;
  overflow-y: hidden;

  &:after {
    content: '';
    background: linear-gradient(
      ${x => x.theme.colors.utility.transparent} 0%,
      white 95%
    );
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`

const ImageContainer = styled(Box)`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(${props => props.src});
  width: 100%;
  height: 100%;
`

const LinkContainer = styled(Box).attrs({
  my: 3,
  p: 3,
})`
  min-width: 100%;
  text-align: center;
  display: flex;
  position: relative;
  overflow: hidden;
`

const LinkText = styled(Text).attrs({
  f: 1,
  align: 'left',
  font: 'mono',
  color: 'gray.semiBold',
})`
  overflow: hidden;
`

const Overlay = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  > * {
    display: none;
  }

  &:hover > * {
    display: block;
  }
`

const RemoveButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background-color: ${x => x.theme.colors.gray.regular};
  border-radius: 1em;
  width: 1em;
  height: 1em;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;

  &:hover {
    background-color: ${x => x.theme.colors.gray.medium};
  }

  &:after {
    content: '𝖷';
    color: ${x => x.theme.colors.white};
    line-height: 1em;
    vertical-align: text-top;
    text-align: center;
  }
`

class Block extends PureComponent {
  static propTypes = {
    block: PropTypes.object.isRequired,
    removeBlock: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  onRemove = () => {
    const { block, removeBlock } = this.props
    removeBlock(block.id)
  }

  onEdit = () => {
    const { history, block } = this.props
    history.push(`/edit/${block.id}`)
  }

  render() {
    const { block } = this.props
    const isText = block.type === 'Text' || block.type === 'Link'

    return (
      <Container isText={isText}>
        {block.type === 'Text' && (
          <TextContainer>
            <Text f={2} font="serif">
              <Truncate suffix="..." length={220}>
                {block.value}
              </Truncate>
            </Text>
          </TextContainer>
        )}
        {block.type === 'Link' && (
          <LinkContainer>
            <LinkText>
              <Truncate suffix="..." length={40}>
                {block.value}
              </Truncate>
            </LinkText>
          </LinkContainer>
        )}
        {block.type === 'Image' && <ImageContainer src={block.value} />}
        <Overlay>
          {block.type !== 'Link' && (
            <FilledButton f={0} bg="white" onClick={this.onEdit}>
              Edit
            </FilledButton>
          )}
          <RemoveButton onClick={this.onRemove} />
        </Overlay>
      </Container>
    )
  }
}

export default withRouter(Block)
