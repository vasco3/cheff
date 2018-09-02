import React from 'react';
import Link from 'next/link';
import numeral from 'numeral';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Grid, GridCell } from 'rmwc/Grid';
import { Fab } from 'rmwc/Fab';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { List, SimpleListItem } from 'rmwc/List';
import { TabBar, Tab } from 'rmwc/Tabs';

import { RECIPES_MINIMUM } from '../recipes/constants';
import { withCoreContext } from '../CoreContext';

import MacrosRings from './MacrosRings';
import Macro from './Macro';

class Plan extends React.Component {
  state = {
    activeTab: 0,
  };
  render() {
    const {
      isMobile = false,
      isWorkoutDay = false,
      menu = [],
      handleMenuGenerate,
      handleTracker,
      recipes = [],
      macrosRest = {},
      macrosWorkout = {},
      tracker = {},
    } = this.props;
    const { activeTab } = this.state;
    const macros = isWorkoutDay ? macrosWorkout : macrosRest;
    const showMacros = isMobile ? activeTab === 0 : true;
    const showFood = isMobile ? activeTab === 1 : true;
    return (
      <div>
        {isWorkoutDay && (
          <div className="banner text-center">
            <Typography use="subtitle1" theme="onSecondary">
              Workout Day
            </Typography>
          </div>
        )}
        {isMobile && (
          <TabBar
            activeTabIndex={activeTab}
            onActivate={evt => this.setState({ activeTab: evt.detail.index })}
          >
            <Tab>Macros</Tab>
            <Tab>Food</Tab>
          </TabBar>
        )}
        <Grid>
          {showMacros && (
            <GridCell span="6" mobile="12">
              <Card outlined>
                <div className="flex justify-between px-4 py-6 items-center">
                  <Typography use="headline5">
                    {numeral(tracker.calories).format('0,0')} /{' '}
                    {numeral(macros.calories).format('0,0')} cal
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
                  increment={10}
                  name="carbs"
                  target={macros.carbs}
                  total={tracker.carbs}
                  onAction={handleTracker}
                />
                <Macro
                  increment={5}
                  name="protein"
                  target={macros.protein}
                  total={tracker.protein}
                  onAction={handleTracker}
                />
                <Macro
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
            <GridCell span="6" mobile="12">
              <Card outlined>
                <div className="flex justify-between p-4 items-center">
                  <Typography use="headline5">
                    {menu.length > 0 && `${menu.length} servings`}
                  </Typography>
                  <Fab
                    onClick={handleMenuGenerate}
                    icon="autorenew"
                    label="combine"
                  />
                </div>

                <ListDivider />

                {recipes.size < RECIPES_MINIMUM && (
                  <Typography
                    use="headline5"
                    theme="text-secondary-on-background"
                    className="px-4 my-2"
                  >
                    Need {RECIPES_MINIMUM - recipes.size} more recipes to be
                    able to calculate.{' '}
                    <Link href="/recipes">Add more recipes</Link>
                  </Typography>
                )}
                <List twoLine dense>
                  {!menu.length && (
                    <div className="text-center">
                      <Typography
                        use="headline6"
                        tag="div"
                        className="flex justify-center p-4"
                      >
                        Randomly generate a menu plan for the day
                      </Typography>
                      <Button onClick={handleMenuGenerate}>Generate</Button>
                    </div>
                  )}
                  {menu.map(
                    ({ _key, name, Calories, Protein, Carbs, Fat }, index) => (
                      <SimpleListItem
                        key={_key + index}
                        text={name}
                        secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | 1 serving`}
                      />
                    ),
                  )}
                </List>
              </Card>
            </GridCell>
          )}
        </Grid>
        <style jsx>{`
          .banner {
            background-color: var(--mdc-theme-secondary);
          }
        `}</style>
      </div>
    );
  }
}

export default withCoreContext(Plan);
