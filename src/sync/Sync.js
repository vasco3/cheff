import React, { Component } from 'react';
import { Typography } from 'rmwc';

import { withCoreContext } from '../CoreContext';
import Exporter from './Exporter';
import Importer from './Importer';
class Sync extends Component {
  state = {};
  render() {
    return (
      <div className="m-4">
        <Typography use="headline6" tag="div">
          Sync your recipe data within your laptop and mobile devices
        </Typography>
        <Exporter recipes={this.props.recipes} />
        <Importer importRecipes={this.props.handleRecipesTorrentImport} />
      </div>
    );
  }
}

export default withCoreContext(Sync);
