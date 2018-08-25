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
const RECIPES_MINIMUM = 10;
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
      CALORIES_TOTAL: 2700,
      PROTEIN_TOTAL: 150,
      caloriesTotal: 0,
      carbsTotal: 0,
      fatTotal: 0,
      menu: [],
      proteinTotal: 0,
      recipes,
      settingsOpen: false,
    };
  }

  calculate() {
    const { state } = this;
    const { CALORIES_TOTAL, PROTEIN_TOTAL } = state;

    const settings = calculateSettings({ CALORIES_TOTAL, PROTEIN_TOTAL });

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
    const hasEnoughRecipes = RECIPES_MINIMUM < state.recipes.size;
    return (
      <main>
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

          <Settings
            CALORIES_TOTAL={state.CALORIES_TOTAL}
            PROTEIN_TOTAL={state.PROTEIN_TOTAL}
            onChange={this.updateSettings}
            open={state.settingsOpen}
          onClose={this.toggleSettings}
          />
        <div className="mdc-top-app-bar--dense-fixed-adjust">
          <Grid>
            {hasEnoughRecipes && (
              <GridCell span="6" tablet="12">
                <Menu
                  caloriesTotal={state.caloriesTotal}
                  carbsTotal={state.carbsTotal}
                  fatTotal={state.fatTotal}
                  menu={state.menu}
                  onGenerate={this.calculate}
                  proteinTotal={state.proteinTotal}
                />
              </GridCell>
            )}
            <GridCell span="6" tablet="12">
              <Recipes
                onAdd={this.handleAddRecipe}
                recipes={state.recipes.toArray()}
                hasEnoughRecipes={hasEnoughRecipes}
              />
            </GridCell>
          </Grid>
        </div>
      </main>
    );
  }
}

export default Cheff;
