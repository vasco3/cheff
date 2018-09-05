import Link from 'next/link';

import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Fab } from 'rmwc/Fab';
import { GridCell } from 'rmwc/Grid';
import { List, SimpleListItem } from 'rmwc/List';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';

function Food({
  menu,
  handleMenuGenerate,
  handleRecipeFavoriteToggle,
  hasRecipesMinimum,
  recipes,
  recipesFavoriteKeys,
}) {
  return (
    <GridCell span="6" mobile="12">
      <Card outlined>
        <div className="flex justify-between p-4 items-center">
          <Typography use="headline5">
            {menu.length > 0 && `${menu.length} servings`}
          </Typography>
          <Fab onClick={handleMenuGenerate} icon="autorenew" label="shuffle" />
        </div>

        <ListDivider />

        {hasRecipesMinimum && (
          <Typography
            use="headline5"
            theme="text-secondary-on-background"
            className="px-4 my-2"
          >
            Need {RECIPES_MINIMUM - recipes.size} more recipes to be able to
            calculate.{' '}
            <Link href="/recipes">
              <Button>Add more recipes</Button>
            </Link>
          </Typography>
        )}
        <List twoLine dense>
          {hasRecipesMinimum &&
            !menu.length && (
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

          {menu.map(({ _key, name, Calories, Protein, Carbs, Fat }, index) => {
            const locked = recipesFavoriteKeys.has(_key);
            const action = locked ? 'delete' : 'add';
            return (
              <SimpleListItem
                key={_key + index}
                text={name}
                graphic={locked ? 'lock' : 'lock_open'}
                secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g`}
                onClick={() =>
                  handleRecipeFavoriteToggle({ action, recipeKey: _key })
                }
              />
            );
          })}
        </List>
      </Card>
    </GridCell>
  );
}

export default Food;
