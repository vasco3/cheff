import React from 'react';
import { Card, CardAction, CardActions } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { List, SimpleListItem } from 'rmwc/List';
import numeral from 'numeral';

const Menu = ({
  menu,
  caloriesTotal,
  carbsTotal,
  fatTotal,
  proteinTotal,
  onGenerate,
}) => {
  return (
    <Card outlined>
      <CardActions fullBleed>
        <CardAction onClick={onGenerate}>
          Menu <Icon use="autorenew" />
        </CardAction>
      </CardActions>
      <ListDivider />

      <Typography
        use="subtitle1"
        theme="text-secondary-on-background"
        className="px-4 py-2"
      >
        {menu.length > 0 ? (
          <React.Fragment>
            {numeral(caloriesTotal).format('0,0')} cal, protein {proteinTotal}
            g, carbs {carbsTotal} g, fat {fatTotal} g, {menu.length} servings
          </React.Fragment>
        ) : (
          'Generate Menu'
        )}
      </Typography>
      {menu.length > 0 && <ListDivider />}

      <List twoLine dense>
        {menu.map(
          ({ _key, name, Calories, Protein, Carbs, Fat, type = '' }, index) => (
            <SimpleListItem
              key={_key + index}
              graphic="check_box_outline_blank"
              text={`${name} (${type.toLowerCase()})`}
              secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | 1 serving`}
            />
          ),
        )}
      </List>
    </Card>
  );
};

export default Menu;
