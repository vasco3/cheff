import React from 'react';
import Link from 'next/link';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Chip, ChipText, ChipIcon, ChipSet } from 'rmwc/Chip';
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
        Day Meal Plan{' '}
        <Typography use="caption">
          {menu.length > 0 && `(${menu.length} servings)`}
        </Typography>
      </Typography>

      <ListDivider />

      <div className="fab flex justify-end pr-4">
        <Fab onClick={handleMenuGenerate} icon="autorenew" />
      </div>

      <Typography
        use="headline5"
        theme="text-secondary-on-background"
        className="mx-4 my-2"
      >
        {numeral(menuCaloriesTotal).format('0,0')} cal
      </Typography>

      <ChipSet className="flex justify-around mb-2">
        <Chip>
          <ChipText>protein {menuProteinTotal || 0}g</ChipText>
        </Chip>
        <Chip>
          <ChipText>carbs {menuCarbsTotal}g</ChipText>
        </Chip>
        <Chip>
          <ChipText>fat {menuFatTotal}g</ChipText>
        </Chip>
      </ChipSet>
      <Typography use="subtitle2" theme="text-secondary-on-background" />

      <ListDivider />

      {recipes.size < RECIPES_MINIMUM && (
        <Typography
          use="headline5"
          theme="text-secondary-on-background"
          className="mx-4 my-2"
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
              className="flex justify-center m-4"
            >
              Randomly generate a menu plan for the day
            </Typography>
            <Button onClick={handleMenuGenerate} className="">
              Generate
            </Button>
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
