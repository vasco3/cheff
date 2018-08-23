import React, { Component } from 'react';
import { List } from 'immutable';
import { Grid, GridCell } from 'rmwc/Grid';

import Recipes from './Recipes';
import Menu from './Menu';
import recipes from '../data/recipes';

import { calculateDayMenu, calculateSettings, randomSort } from './util';

class Cheff extends Component {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    const settings = calculateSettings({
      BODY_WEIGHT_LBS: 180,
      CALORIES_TOLERANCE: 50,
      PROTEIN_PER_BODY_LB: 1,
      TOTAL_CALORIES: 3200,
    });
    this.state = {
      menu: [],
      caloriesTotal: 0,
      proteinTotal: 0,
      carbsTotal: 0,
      fatTotal: 0,
      recipes,
      settings,
    };
  }
  calculate() {
    const { state } = this;
    const { menu, calories, carbs, fat, protein } = calculateDayMenu({
      recipes: List(state.recipes).sort(randomSort),
      settings: state.settings,
    });
    this.setState({
      menu,
      proteinTotal: protein,
      caloriesTotal: calories,
      carbsTotal: carbs,
      fatTotal: fat,
    });
  }
  render() {
    const { state } = this;
    return (
      <Grid>
        <GridCell span="6">
          <Menu
            caloriesTotal={state.caloriesTotal}
            carbsTotal={state.carbsTotal}
            fatTotal={state.fatTotal}
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
