import React from 'react';
import Link from 'next/link';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Fab } from 'rmwc/Fab';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { List, SimpleListItem } from 'rmwc/List';
import numeral from 'numeral';

import { RECIPES_MINIMUM } from '../recipes/constants';
import { withCoreContext } from '../CoreContext';

function Plan({
  menu = [],
  menuCaloriesTotal,
  menuCarbsTotal,
  menuFatTotal,
  menuProteinTotal,
  handleMenuGenerate,
  recipes = [],
}) {
  return (
    <Card outlined>
      <Typography use="subtitle1" tag="div" className="m-4">
        Day Meal Plan {menu.length > 0 && `(${menu.length} servings)`}
      </Typography>

      <ListDivider />

      <div className="fab flex justify-end pr-4">
        <Fab onClick={handleMenuGenerate} icon="autorenew" label="Generate" />
      </div>

      <Typography
        use="subtitle2"
        theme="text-secondary-on-background"
        className="mx-4 mt-4 mb-2"
      >
        {numeral(menuCaloriesTotal).format('0,0')} cal, protein{' '}
        {menuProteinTotal} g, carbs {menuCarbsTotal} g, fat {menuFatTotal} g
      </Typography>

      <ListDivider />

      {recipes.size < RECIPES_MINIMUM && (
        <Typography
          use="headline3"
          theme="text-secondary-on-background"
          className="mx-4 my-2"
        >
          Need {RECIPES_MINIMUM - recipes.size} more recipes to be able to
          calculate. <Link href="/recipes">Add more recipes</Link>
        </Typography>
      )}
      <List twoLine dense>
        {!menu.length && (
          <Typography
            use="headline6"
            tag="div"
            className="flex justify-center m-4"
          >
            Randomly generate a menu plan for the day
            <Button onClick={handleMenuGenerate}>Generate</Button>
          </Typography>
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
