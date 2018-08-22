import { Card, CardAction, CardActions } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import { ListDivider } from 'rmwc/List';
import { List, SimpleListItem } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';

const Recipes = ({ recipes, onAdd }) => {
  return (
    <Card outlined>
      <CardActions fullBleed>
        <CardAction onClick={onAdd}>Recipes</CardAction>
      </CardActions>
      <ListDivider />

      <List twoLine dense>
        {recipes.map(
          ({ _key, name, Calories, Protein, Carbs, Fat, type, servings }) => (
            <SimpleListItem
              key={_key}
              graphic="restaurant"
              text={`${name} (${type.toLowerCase()})`}
              secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | ${servings} servings`}
              meta="chevron_right"
            />
          ),
        )}
      </List>
    </Card>
  );
};

export default Recipes;
