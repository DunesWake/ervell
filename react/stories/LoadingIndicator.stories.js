import React from 'react';
import { storiesOf } from '@storybook/react';

import Specimen from 'react/stories/__components__/Specimen';
import LoadingIndicator from 'react/components/UI/LoadingIndicator';

const HEXAGRAMS = [
  '䷀', '䷁', '䷂', '䷃', '䷄', '䷅', '䷆', '䷇', '䷈', '䷉', '䷊', '䷋', '䷌', '䷍', '䷎', '䷏',
  '䷐', '䷑', '䷒', '䷓', '䷔', '䷕', '䷖', '䷗', '䷘', '䷙', '䷚', '䷛', '䷜', '䷝', '䷞', '䷟',
  '䷠', '䷡', '䷢', '䷣', '䷤', '䷥', '䷦', '䷧', '䷨', '䷩', '䷪', '䷫', '䷬', '䷭', '䷮', '䷯',
  '䷰', '䷱', '䷲', '䷳', '䷴', '䷵', '䷶', '䷷', '䷸', '䷹', '䷺', '䷻', '䷼', '䷽', '䷾', '䷿',
];

storiesOf('LoadingIndicator', module)
  .add('default', () => (
    <Specimen>
      <LoadingIndicator />
    </Specimen>
  ))
  .add('alternate spinners', () => (
    <Specimen>
      <LoadingIndicator frames={['🌍', '🌎', '🌏']} interval={150} />
      <LoadingIndicator frames={['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']} interval={50} />
      <LoadingIndicator frames={['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']} interval={100} />
      <LoadingIndicator frames={['|', '/', '-', '\\']} interval={100} />
      <LoadingIndicator frames={['▖', '▘', '▝', '▗']} interval={100} />
      <LoadingIndicator frames={HEXAGRAMS} interval={100} />
    </Specimen>
  ));
