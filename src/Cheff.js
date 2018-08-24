/* global localStorage */
import React, { Component, Fragment } from 'react';
import getIn from 'lodash/get';
import { List } from 'immutable';
import { Grid, GridCell } from 'rmwc/Grid';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarActionItem,
  TopAppBarSection,
  TopAppBarTitle,
} from 'rmwc/TopAppBar';

import Menu from './Menu';
import Recipes from './Recipes';
import Settings from './Settings';

import { calculateDayMenu, calculateSettings, randomSort } from './util';

class Cheff extends Component {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);

    const recipesJSON =
      typeof localStorage === 'undefined'
        ? []
        : JSON.parse(localStorage.getItem('recipes') || '[]');
    const recipes = List(recipesJSON);

    this.state = {
      BODY_WEIGHT_LBS: 180,
      CALORIES_TOLERANCE: 50,
      PROTEIN_PER_BODY_LB: 1,
      TOTAL_CALORIES: 3200,
      caloriesTotal: 0,
      carbsTotal: 0,
      fatTotal: 0,
      menu: [],
      settingsOpen: false,
      proteinTotal: 0,
      recipes,
    };
  }

  calculate() {
    const { state } = this;
    const {
      BODY_WEIGHT_LBS,
      CALORIES_TOLERANCE,
      PROTEIN_PER_BODY_LB,
      TOTAL_CALORIES,
    } = state;

    const settings = calculateSettings({
      BODY_WEIGHT_LBS,
      CALORIES_TOLERANCE,
      PROTEIN_PER_BODY_LB,
      TOTAL_CALORIES,
    });
    const { menu, calories, carbs, fat, protein } = calculateDayMenu({
      recipes: state.recipes.sort(randomSort),
      settings,
    });

    this.setState({
      menu,
      proteinTotal: protein,
      caloriesTotal: calories,
      carbsTotal: carbs,
      fatTotal: fat,
    });
  }

  handleAddRecipe(recipe) {
    const recipes = this.state.recipes.push(recipe);

    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  toggleSettings() {
    this.setState(prevState => ({ settingsOpen: !prevState.settingsOpen }));
  }

  updateSettings(event) {
    const name = getIn(event, 'target.name');
    const value = getIn(event, 'target.value');
    this.setState({ [name]: parseFloat(value, 10) });
  }

  render() {
    const { state } = this;
    return (
      <Fragment>
        <TopAppBar dense>
          <TopAppBarRow>
            <TopAppBarSection>
              <TopAppBarTitle>Cheff</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
              <TopAppBarActionItem alt="Settings" onClick={this.toggleSettings}>
                settings
              </TopAppBarActionItem>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>

        <div
          className="mdc-top-app-bar--dense-fixed-adjust"
          style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}
        >
          <Settings
            open={state.settingsOpen}
            onChange={this.updateSettings}
            BODY_WEIGHT_LBS={state.BODY_WEIGHT_LBS}
            CALORIES_TOLERANCE={state.CALORIES_TOLERANCE}
            PROTEIN_PER_BODY_LB={state.PROTEIN_PER_BODY_LB}
            TOTAL_CALORIES={state.TOTAL_CALORIES}
          />
          <Grid>
            <GridCell span="6" tablet="12">
              <Menu
                caloriesTotal={state.caloriesTotal}
                carbsTotal={state.carbsTotal}
                fatTotal={state.fatTotal}
                menu={state.menu}
                proteinTotal={state.proteinTotal}
                onGenerate={this.calculate}
              />
            </GridCell>
            <GridCell span="6" tablet="12">
              <Recipes
                recipes={state.recipes.toArray()}
                onAdd={this.handleAddRecipe}
              />
            </GridCell>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export default Cheff;
