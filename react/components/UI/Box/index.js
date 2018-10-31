import styled, { css } from 'styled-components';
import {
  display,
  space,
  width,
  height,
  alignItems,
  minHeight,
  maxHeight,
  justifyContent,
  flexDirection,
  borders,
  borderColor,
  borderRadius,
  bgColor,
} from 'styled-system';

import { neutralMargins } from 'react/styles/mixins';

export const mixin = css`
  box-sizing: border-box;
  ${display}
  ${width}
  ${height}
  ${minHeight}
  ${maxHeight}
  ${space}
  ${alignItems}
  ${justifyContent}
  ${flexDirection}
  ${borders}
  ${borderColor}
  ${borderRadius}
  ${bgColor}
  ${neutralMargins}
`;

export default styled.div`
  ${mixin}
`;
