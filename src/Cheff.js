/* global localStorage */
import React, { Component } from 'react';
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

import demoRecipes from '../data/recipes';

import { calculateDayMenu, calculateSettings, randomSort } from './util';
const RECIPES_MINIMUM = 10;
class Cheff extends Component {
  constructor(props) {
    super(props);
    this.calculate = this.calculate.bind(this);
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
    this.handleRemoveRecipe = this.handleRemoveRecipe.bind(this);
    this.importDemoRecipes = this.importDemoRecipes.bind(this);
    this.importRecipes = this.importRecipes.bind(this);
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

  handleRemoveRecipe(recipeKeys) {
    const recipes = this.state.recipes.filter(
      recipe => !recipeKeys.includes(recipe._key),
    );

    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  importDemoRecipes() {
    const recipes = List(demoRecipes);
    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  importRecipes(recipesScanned) {
    const recipes = List(recipesScanned);

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
    const hasEnoughRecipes = RECIPES_MINIMUM <= state.recipes.size;
    return (
      <main>
        <TopAppBar dense>
          <TopAppBarRow>
            <TopAppBarSection>
              <TopAppBarActionItem alt="Menu" onClick={this.toggleSettings}>
                menu
              </TopAppBarActionItem>
              <TopAppBarTitle>Cheff</TopAppBarTitle>
            </TopAppBarSection>
            {/* <TopAppBarSection alignEnd>
              <TopAppBarActionItem alt="info" onClick={this.toggleSettings}>
                info
              </TopAppBarActionItem>
            </TopAppBarSection> */}
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
                onRemove={this.handleRemoveRecipe}
                recipes={state.recipes.toArray()}
                recipesMinimumCount={RECIPES_MINIMUM}
                hasEnoughRecipes={hasEnoughRecipes}
                importDemoRecipes={this.importDemoRecipes}
                importRecipes={this.importRecipes}
              />
            </GridCell>
          </Grid>
        </div>
      </main>
    );
  }
}

export default Cheff;
