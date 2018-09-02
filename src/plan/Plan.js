import React from 'react';
import Link from 'next/link';
import numeral from 'numeral';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Fab } from 'rmwc/Fab';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { List, SimpleListItem } from 'rmwc/List';

import { RECIPES_MINIMUM } from '../recipes/constants';
import { withCoreContext } from '../CoreContext';

import MacrosRings from './MacrosRings';
import Macro from './Macro';

function Plan({
  menu = [],
  handleMenuGenerate,
  handleTracker,
  recipes = [],
  macrosRest = {},
  macrosWorkout = {},
  isWorkoutDay = false,
  tracker = {},
}) {
  const macros = isWorkoutDay ? macrosWorkout : macrosRest;
  return (
    <Card outlined>
      <Typography use="subtitle1" tag="div" className="p-4">
        Day Meal Plan{' '}
        <Typography use="caption">
          {menu.length > 0 && `(${menu.length} servings)`}
        </Typography>
      </Typography>

      <ListDivider />

      <div className="fab flex justify-end pr-4">
        <Fab onClick={handleMenuGenerate} icon="autorenew" />
      </div>

      <Typography use="headline4" tag="div" className="m-4">
        {numeral(tracker.calories).format('0,0')} /{' '}
        {numeral(macros.calories).format('0,0')} cal
      </Typography>
      <div className="">
        <MacrosRings
          calories={{ total: tracker.calories, target: macros.calories }}
          carbs={{ total: tracker.carbs, target: macros.carbs }}
          fat={{ total: tracker.fat, target: macros.fat }}
          protein={{ total: tracker.protein, target: macros.protein }}
        />
      </div>

      <div>
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
      </div>

      <ListDivider />

      {recipes.size < RECIPES_MINIMUM && (
        <Typography
          use="headline5"
          theme="text-secondary-on-background"
          className="px-4 my-2"
        >
          Need {RECIPES_MINIMUM - recipes.size} more recipes to be able to
          calculate. <Link href="/recipes">Add more recipes</Link>
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
        {menu.map(({ _key, name, Calories, Protein, Carbs, Fat }, index) => (
          <SimpleListItem
            key={_key + index}
            text={name}
            secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | 1 serving`}
          />
        ))}
      </List>
      <style jsx>{`
        .fab {
          margin-top: -2rem;
          margin-bottom: -1.5rem;
        }
      `}</style>
    </Card>
  );
}

export default withCoreContext(Plan);
