import React, { Component } from 'react';
import { List } from 'immutable';
import { Grid, GridCell } from 'rmwc/Grid';

import Recipes from './Recipes';
import Menu from './Menu';
import recipes from '../data/recipes';

import { calculateDayMenu, randomSort } from './util';

class Cheff extends Component {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.state = { menu: [], proteinTotal: 0, caloriesTotal: 0, recipes };
  }
  calculate() {
    const { menu, protein, calories } = calculateDayMenu({
      recipes: List(this.state.recipes).sort(randomSort),
    });
    this.setState({ menu, proteinTotal: protein, caloriesTotal: calories });
  }
  render() {
    const { state } = this;
    return (
      <Grid>
        <GridCell span="6">
          <Menu
            caloriesTotal={state.caloriesTotal}
            menu={state.menu}
            proteinTotal={state.proteinTotal}
            onGenerate={this.calculate}
          />
        </GridCell>
        <GridCell span="6">
          <Recipes recipes={state.recipes} />
        </GridCell>
      </Grid>
    );
  }
}

export default Cheff;
