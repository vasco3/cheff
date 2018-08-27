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
