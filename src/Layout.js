import React, { Component } from 'react';
import Link from 'next/link';
import moment from 'moment';
import getIn from 'lodash/get';
import { List, Set as iSet } from 'immutable';
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarActionItem,
  TopAppBarSection,
  TopAppBarTitle,
} from 'rmwc/TopAppBar';

import CoreContext from './CoreContext';
import MenuDrawer from './MenuDrawer';
import { calculateDayMenu, calculateSettings, prioritizeAndSort } from './util';
import { convertMacroGramToCalories } from './calculator/utils';
import demoRecipes from '../data/recipes';

function loadLocalValues() {
  if (typeof window === 'undefined') {
    return {
      isWorkoutDay: false,
      macrosRest: {},
      macrosWorkout: {},
      menu: [],
      recipes: List(),
      recipesFavoriteKeys: iSet(),
      settings: {},
      tracker: { calories: 0, carbs: 0, protein: 0, fat: 0 },
    };
  }

  const recipesJSON = getItem('recipes', '[]');
  const recipesFavoriteKeysJSON = getItem('recipesFavoriteKeys', '[]');
  const settings = getItem('settings', '{}');
  const tracker = getItem('tracker', '{}');

  return {
    isWorkoutDay: shouldWorkout(settings),
    macrosRest: getItem('macrosRest', '{}'),
    macrosWorkout: getItem('macrosWorkout', '{}'),
    menu: getItem('menu', '[]'),
    recipes: List(recipesJSON),
    recipesFavoriteKeys: iSet(recipesFavoriteKeysJSON),
    settings,
    tracker: {
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
      ...tracker,
    },
  };
}

function getItem(name, defaultValue = '') {
  return JSON.parse(localStorage.getItem(name) || defaultValue);
}

function shouldWorkout({
  workoutOnSunday,
  workoutOnMonday,
  workoutOnTuesday,
  workoutOnWednesday,
  workoutOnThursday,
  workoutOnFriday,
  workoutOnSaturday,
}) {
  const weekdays = [
    workoutOnSunday,
    workoutOnMonday,
    workoutOnTuesday,
    workoutOnWednesday,
    workoutOnThursday,
    workoutOnFriday,
    workoutOnSaturday,
  ];
  return weekdays[moment().day()];
}
class Layout extends Component {
  constructor(props) {
    super(props);

    const {
      menu,
      macrosRest,
      macrosWorkout,
      recipes,
      recipesFavoriteKeys,
      settings,
      tracker,
    } = loadLocalValues();

    this.state = {
      drawerIsOpen: false,
      isWorkoutDay: shouldWorkout(settings),
      macrosRest,
      macrosWorkout,
      menu,
      handleMenuGenerate: this.handleMenuGenerate.bind(this),
      recipes,
      recipesFavoriteKeys,
      handleRecipeFavoriteToggle: this.handleRecipeFavoriteToggle.bind(this),
      handleRecipeAdd: this.handleRecipeAdd.bind(this),
      handleRecipeRemove: this.handleRecipeRemove.bind(this),
      handleRecipeEdit: this.handleRecipeEdit.bind(this),
      handleRecipesImportDemo: this.handleRecipesImportDemo.bind(this),
      handleCalculatorSave: this.handleCalculatorSave.bind(this),
      handleTracker: this.handleTracker.bind(this),
      settings,
      tracker,
    };
  }

  handleTracker({ action, macro, value }) {
    const macroCalories = convertMacroGramToCalories({ macro, value });

    switch (action) {
      case 'reset': {
        const tracker = { calories: 0, carbs: 0, fat: 0, protein: 0 };
        this.setState({ tracker }, () =>
          localStorage.setItem('tracker', JSON.stringify(tracker)),
        );
        break;
      }

      case 'add':
        this.setState(
          prevState => {
            const tracker = {
              ...prevState.tracker,
              [macro]: prevState.tracker[macro] + value,
              calories: prevState.tracker.calories + macroCalories,
            };
            return { tracker };
          },
          () => {
            localStorage.setItem('tracker', JSON.stringify(this.state.tracker));
          },
        );
        break;

      case 'subtract':
        this.setState(
          prevState => {
            const tracker = {
              ...prevState.tracker,
              [macro]: prevState.tracker[macro] - value,
              calories: prevState.tracker.calories - macroCalories,
            };
            return { tracker };
          },
          () => {
            localStorage.setItem('tracker', JSON.stringify(this.state.tracker));
          },
        );
      default:
        break;
    }
  }

  handleMenuGenerate() {
    const { state } = this;
    const macros = getIn(
      state,
      state.isWorkoutDay ? 'macrosWorkout' : 'macrosRest',
      {},
    );

    const settings = calculateSettings({
      calories: macros.calories - state.tracker.calories,
      carbs: macros.carbs - state.tracker.carbs,
      fat: macros.fat - state.tracker.fat,
      protein: macros.protein - state.tracker.protein,
    });

    try {
      const { menu } = calculateDayMenu({
        recipes: prioritizeAndSort(state.recipes, state.recipesFavoriteKeys),
        recipesFavoriteKeys: state.recipesFavoriteKeys,
        settings,
      });

      this.setState({ menu }, function saveMenuToLocal() {
        localStorage.setItem('menu', JSON.stringify(menu));
      });
    } catch (err) {
      console.error(err);
    }
  }

  handleRecipeFavoriteToggle({ action = 'add', recipeKey }) {
    this.setState(prevState => {
      const recipesFavoriteKeys = prevState.recipesFavoriteKeys[action](
        recipeKey,
      );
      localStorage.setItem(
        'recipesFavoriteKeys',
        JSON.stringify(recipesFavoriteKeys.toArray()),
      );
      return { recipesFavoriteKeys };
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

  importRecipes(recipesScanned) {
    const recipes = List(recipesScanned);

    this.setState({ recipes }, function saveRecipesToLocal() {
      localStorage.setItem('recipes', JSON.stringify(recipes.toArray()));
    });
  }

  handleCalculatorSave({ macrosRest, macrosWorkout, settings }) {
    this.setState(
      {
        isWorkoutDay: shouldWorkout(settings),
        macrosRest,
        macrosWorkout,
        settings,
      },
      function saveSettingsToLocal() {
        localStorage.setItem('macrosRest', JSON.stringify(macrosRest));
        localStorage.setItem('macrosWorkout', JSON.stringify(macrosWorkout));
        localStorage.setItem('settings', JSON.stringify(settings));
      },
    );
  }

  toggleDrawer = () => {
    this.setState(prevState => ({ drawerIsOpen: !prevState.drawerIsOpen }));
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
            <TopAppBarSection alignEnd>
              <Link href="/plan">
                <TopAppBarActionItem alt="menu plan">
                  list_alt
                </TopAppBarActionItem>
              </Link>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>

        <div className="mdc-top-app-bar--dense-fixed-adjust">
          <MenuDrawer
            onClose={() => this.setState({ drawerIsOpen: false })}
            open={state.drawerIsOpen}
          />
          <CoreContext.Provider value={this.state}>
            {props.children}
          </CoreContext.Provider>
        </div>
      </main>
    );
  }
}

export default Layout;
