import React, { Component } from 'react';
import Link from 'next/link';
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
import demoRecipes from '../data/recipes';

function loadLocalValues() {
  if (typeof window === 'undefined') {
    return {
      menu: [],
      menuProteinTotal: 0,
      menuCaloriesTotal: 0,
      menuCarbsTotal: 0,
      menuFatTotal: 0,
      recipes: List(),
      settings: {},
    };
  }

  const recipesJSON = JSON.parse(localStorage.getItem('recipes') || '[]');

  return {
    menu: JSON.parse(localStorage.getItem('menu') || '[]'),
    menuCaloriesTotal: getNumber('menuCaloriesTotal'),
    menuCarbsTotal: getNumber('menuCarbsTotal'),
    menuFatTotal: getNumber('menuFatTotal'),
    menuProteinTotal: getNumber('menuProteinTotal'),
    recipes: List(recipesJSON),
    settings: JSON.parse(localStorage.getItem('settings') || '{}'),
  };
}

function getNumber(name) {
  const result = parseInt(localStorage.getItem(name), 10);
  return Number.isFinite(result) ? result : 0;
}
class Layout extends Component {
  constructor(props) {
    super(props);

    const {
      menu,
      menuCaloriesTotal,
      menuCarbsTotal,
      menuFatTotal,
      menuProteinTotal,
      recipes,
      settings,
    } = loadLocalValues();

    this.state = {
      drawerIsOpen: false,
      isMobile: true,
      menu,
      menuCaloriesTotal,
      menuCarbsTotal,
      menuFatTotal,
      menuProteinTotal,
      handleMenuGenerate: this.handleMenuGenerate.bind(this),
      recipes,
      handleRecipeAdd: this.handleRecipeAdd.bind(this),
      handleRecipeRemove: this.handleRecipeRemove.bind(this),
      handleRecipeEdit: this.handleRecipeEdit.bind(this),
      handleRecipesImportDemo: this.handleRecipesImportDemo.bind(this),
      handleCalculatorUpdate: this.handleCalculatorUpdate.bind(this),
      settings,
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

  handleMenuGenerate() {
    const { state } = this;
    const { CALORIES_TOTAL, CARBS_TOTAL, FAT_TOTAL, PROTEIN_TOTAL } = getIn(
      state,
      'settings',
      {},
    );

    const settings = calculateSettings({
      CALORIES_TOTAL,
      CARBS_TOTAL,
      FAT_TOTAL,
      PROTEIN_TOTAL,
    });

    const { menu, calories, carbs, fat, protein } = calculateDayMenu({
      recipes: state.recipes.sort(randomSort),
      settings,
    });

    this.setState(
      {
        menu,
        menuProteinTotal: protein,
        menuCaloriesTotal: calories,
        menuCarbsTotal: carbs,
        menuFatTotal: fat,
      },
      function saveMenuToLocal() {
        localStorage.setItem('menu', JSON.stringify(menu));
        localStorage.setItem('menuProteinTotal', protein);
        localStorage.setItem('menuCaloriesTotal', calories);
        localStorage.setItem('menuCarbsTotal', carbs);
        localStorage.setItem('menuFatTotal', fat);
      },
    );
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

  handleCalculatorUpdate(settings) {
    this.setState({ settings }, function saveSettingsToLocal() {
      localStorage.setItem('settings', JSON.stringify(settings));
    });
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
