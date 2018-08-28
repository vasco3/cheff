import React, { Component } from 'react';
import { List } from 'immutable';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarActionItem,
  TopAppBarSection,
  TopAppBarTitle,
} from 'rmwc/TopAppBar';

import CoreContext from './CoreContext';
import MenuDrawer from './MenuDrawer';
import { calculateDayMenu, calculateSettings, randomSort } from './util';
import demoRecipes from '../data/recipes';

class Layout extends Component {
  constructor(props) {
    super(props);

    const recipesJSON =
      typeof localStorage === 'undefined'
        ? []
        : JSON.parse(localStorage.getItem('recipes') || '[]');
    const recipes = List(recipesJSON);

    this.state = {
      CALORIES_TOTAL: 2700,
      PROTEIN_TOTAL: 150,
      drawerOpen: false,
      menu: [],
      menuCaloriesTotal: 0,
      menuCarbsTotal: 0,
      menuFatTotal: 0,
      handleMenuGenerate: this.handleMenuGenerate.bind(this),
      recipes,
      handleRecipeAdd: this.handleRecipeAdd.bind(this),
      handleRecipeRemove: this.handleRecipeRemove.bind(this),
      handleRecipeEdit: this.handleRecipeEdit.bind(this),
      handleRecipesImportDemo: this.handleRecipesImportDemo.bind(this),
    };
  }

  handleMenuGenerate() {
    const { state } = this;
    const { CALORIES_TOTAL, PROTEIN_TOTAL } = state;

    const settings = calculateSettings({ CALORIES_TOTAL, PROTEIN_TOTAL });

    const { menu, calories, carbs, fat, protein } = calculateDayMenu({
      recipes: state.recipes.sort(randomSort),
      settings,
    });

    this.setState({
      menu,
      menuProteinTotal: protein,
      menuCaloriesTotal: calories,
      menuCarbsTotal: carbs,
      menuFatTotal: fat,
    });
  }

  handleRecipeAdd(recipe) {
    const recipes = this.state.recipes.unshift(recipe);

    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  handleRecipeEdit(recipeToEdit) {
    const recipeIndex = this.state.recipes.findIndex(
      recipe => recipe._key === recipeToEdit._key,
    );
    if (recipeIndex > -1) {
      const recipes = this.state.recipes.update(
        recipeIndex,
        function updateRecipeInList() {
          return recipeToEdit;
        },
      );

      this.setState({ recipes }, function saveToLocal() {
        localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
      });
    }
  }

  handleRecipeRemove(recipeKeys) {
    const recipes = this.state.recipes.filter(
      recipe => !recipeKeys.includes(recipe._key),
    );

    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  handleRecipesImportDemo() {
    const recipes = List(demoRecipes);
    this.setState({ recipes }, function saveToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  // importRecipes(recipesScanned) {
  //   const recipes = List(recipesScanned);

  //   this.setState({ recipes }, function saveToLocal() {
  //     localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
  //   });
  // }

  // updateSettings(event) {
  //   const name = getIn(event, 'target.name');
  //   const value = getIn(event, 'target.value');
  //   this.setState({ [name]: parseFloat(value, 10) });
  // }

  toggleDrawer = () => {
    this.setState(prevState => ({ drawerOpen: !prevState.drawerOpen }));
  };

  render() {
    const { props, state } = this;
    return (
      <main>
        <TopAppBar
          dense
          theme={
            props.pageTitle.toLowerCase() === 'recipes'
              ? 'onSecondary secondaryBg'
              : 'onPrimary primaryBg'
          }
        >
          <TopAppBarRow>
            <TopAppBarSection>
              <TopAppBarActionItem alt="Menu" onClick={this.toggleDrawer}>
                menu
              </TopAppBarActionItem>
              <TopAppBarTitle>{props.pageTitle}</TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>

        <MenuDrawer open={state.drawerOpen} onClose={this.toggleDrawer} />

        <div className="mdc-top-app-bar--dense-fixed-adjust">
          <CoreContext.Provider value={this.state}>
            {props.children}
          </CoreContext.Provider>
        </div>
      </main>
    );
  }
}

export default Layout;
