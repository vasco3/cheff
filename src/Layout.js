import React, { Component } from 'react';
import Link from 'next/link';
import moment from 'moment';
import getIn from 'lodash/get';
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
      settings: {},
      tracker: { calories: 0, carbs: 0, protein: 0, fat: 0 },
    };
  }

  const recipesJSON = getItem('recipes', '[]');
  const settings = getItem('settings', '{}');
  const tracker = getItem('tracker', '{}');

  return {
    isWorkoutDay: shouldWorkout(settings),
    macrosRest: getItem('macrosRest', '{}'),
    macrosWorkout: getItem('macrosWorkout', '{}'),
    menu: getItem('menu', '[]'),
    recipes: List(recipesJSON),
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
}) {
  const weekdays = [
    workoutOnSunday,
    workoutOnMonday,
    workoutOnTuesday,
    workoutOnWednesday,
    workoutOnThursday,
    workoutOnFriday,
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
      settings,
      tracker,
    } = loadLocalValues();

    this.state = {
      drawerIsOpen: false,
      isMobile: true,
      isWorkoutDay: shouldWorkout(settings),
      macrosRest,
      macrosWorkout,
      menu,
      handleMenuGenerate: this.handleMenuGenerate.bind(this),
      recipes,
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

  componentDidMount() {
    window.addEventListener('resize', this.doSizeCheck);
    this.doSizeCheck(true);
  }

  componentDidUpdate(prevProps, prevState) {
    // a hack to help components layout that depend on window events
    // The size of the content changes on drawer open and close
    if (prevState.menuIsOpen !== this.state.menuIsOpen) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.doSizeCheck);
  }

  doSizeCheck = initial => {
    const isMobile = window.innerWidth < 640;
    const drawerIsOpen =
      initial && window.innerWidth > 640 ? true : this.state.drawerIsOpen;

    if (
      this.state.isMobile !== isMobile ||
      this.state.drawerIsOpen !== drawerIsOpen
    ) {
      this.setState({ isMobile, drawerIsOpen });
    }
  };

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

    const { menu } = calculateDayMenu({
      recipes: state.recipes.sort(randomSort),
      settings,
    });

    this.setState({ menu }, function saveMenuToLocal() {
      localStorage.setItem('menu', JSON.stringify(menu));
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
              <Link href="/">
                <TopAppBarActionItem alt="help">help</TopAppBarActionItem>
              </Link>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>

        <div className="mdc-top-app-bar--dense-fixed-adjust appContent">
          <MenuDrawer
            isMobile={state.isMobile}
            open={state.drawerIsOpen}
            persistent={!state.isMobile}
            temporary={state.isMobile}
            onClose={() => this.setState({ drawerIsOpen: false })}
          />
          <CoreContext.Provider value={this.state}>
            {props.children}
          </CoreContext.Provider>
        </div>
        <style jsx>{`
          .appContent {
            display: grid;
            grid-template-columns: ${state.isMobile ? '' : 'auto '} 1fr;
          }
        `}</style>
      </main>
    );
  }
}

export default Layout;
