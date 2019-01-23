import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MODES, SORTS } from 'react/components/Home/config';

import Grid from 'react/components/UI/Grid';
import HeaderMetadataContainer from 'react/components/UI/HeaderMetadata/HeaderMetadataContainer';
import HomeBreadcrumb from 'react/components/HomeMetadata/components/HomeBreadcrumb';
import HomeMetadataView from 'react/components/HomeMetadata/components/HomeMetadataView';
import HomeMetadataSort from 'react/components/HomeMetadata/components/HomeMetadataSort';

class ExploreMetadata extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(MODES),
    sort: PropTypes.oneOf(SORTS),
  }

  static defaultProps = {
    mode: null,
    sort: null,
  }

  render() {
    const { mode, sort } = this.props;

    return (
      <HeaderMetadataContainer
        breadcrumb={<HomeBreadcrumb />}
      >
        <Grid>
          <HomeMetadataView mode={mode} sort={sort} />
          <HomeMetadataSort mode={mode} sort={sort} />
        </Grid>
      </HeaderMetadataContainer>
    );
  }
}

export default ExploreMetadata;
