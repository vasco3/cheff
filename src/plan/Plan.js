import React from 'react';
import numeral from 'numeral';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Grid, GridCell } from 'rmwc/Grid';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { TabBar, Tab } from 'rmwc/Tabs';

import { RECIPES_MINIMUM } from '../recipes/constants';
import { withCoreContext } from '../CoreContext';

import Food from './Food';
import MacrosRings from './MacrosRings';
import Macro from './Macro';

class Plan extends React.Component {
  state = { activeTab: 0 };
  render() {
    const {
      isWorkoutDay = false,
      menu = [],
      handleMenuGenerate,
      handleRecipeFavoriteToggle,
      handleTracker,
      recipes = [],
      recipesFavoriteKeys = [],
      macrosRest = {},
      macrosWorkout = {},
      tracker = {},
    } = this.props;

    const { activeTab } = this.state;

    const macros = isWorkoutDay ? macrosWorkout : macrosRest;
    const showMacros = activeTab === 0;
    const showFood = activeTab === 1;

    const hasRecipesMinimum = recipes.size < RECIPES_MINIMUM;

    return (
      <div className="plan">
        {isWorkoutDay && (
          <div className="banner text-center">
            <Typography use="subtitle1" theme="onSecondary">
              Workout Day
            </Typography>
          </div>
        )}
        <Grid>
          <GridCell span="12">
            <TabBar
              activeTabIndex={activeTab}
              onActivate={evt => this.setState({ activeTab: evt.detail.index })}
            >
              <Tab>Macros</Tab>
              <Tab>Food</Tab>
            </TabBar>
          </GridCell>
          {showMacros && (
            <GridCell span="12">
              <Card outlined>
                <div className="flex justify-between px-4 py-6 items-center">
                  <Typography use="headline5">
                    {numeral(macros.calories - tracker.calories).format('0,0')}{' '}
                    to {numeral(macros.calories).format('0,0')} cal
                  </Typography>
                  <Button onClick={() => handleTracker({ action: 'reset' })}>
                    Reset
                  </Button>
                </div>
                <ListDivider />

                <MacrosRings
                  calories={{
                    total: tracker.calories,
                    target: macros.calories,
                  }}
                  carbs={{ total: tracker.carbs, target: macros.carbs }}
                  fat={{ total: tracker.fat, target: macros.fat }}
                  protein={{ total: tracker.protein, target: macros.protein }}
                />

                <Macro
                  decrement={1}
                  increment={10}
                  name="carbs"
                  target={macros.carbs}
                  total={tracker.carbs}
                  onAction={handleTracker}
                />
                <Macro
                  decrement={1}
                  increment={5}
                  name="protein"
                  target={macros.protein}
                  total={tracker.protein}
                  onAction={handleTracker}
                />
                <Macro
                  decrement={1}
                  increment={5}
                  name="fat"
                  target={macros.fat}
                  total={tracker.fat}
                  onAction={handleTracker}
                />
              </Card>
            </GridCell>
          )}
          {showFood && (
            <Food
              {...{
                menu,
                handleMenuGenerate,
                handleRecipeFavoriteToggle,
                hasRecipesMinimum,
                recipes,
                recipesFavoriteKeys,
              }}
            />
          )}
        </Grid>
        <style jsx>{`
          .plan {
            touch-action: manipulation;
          }
          .banner {
            background-color: var(--mdc-theme-secondary);
          }
        `}</style>
      </div>
    );
  }
}

export default withCoreContext(Plan);
