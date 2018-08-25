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
          Day Menu {menu.length > 0 && `(${menu.length} servings)`}
          <span className={!menu.length && 'bouncy'}>
            <Icon use="autorenew" />
          </span>
        </CardAction>
      </CardActions>
      <ListDivider />

      <Typography
        use="subtitle2"
        theme="text-secondary-on-background"
        className="px-4 py-2"
      >
        {numeral(caloriesTotal).format('0,0')} cal, protein {proteinTotal} g,
        carbs {carbsTotal} g, fat {fatTotal} g
      </Typography>

      <ListDivider />

      <List twoLine dense>
        {menu.map(
          ({ _key, name, Calories, Protein, Carbs, Fat, type = '' }, index) => (
            <SimpleListItem
              key={_key + index}
              graphic="restaurant"
              text={`${name} (${type.toLowerCase()})`}
              secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | 1 serving`}
            />
          ),
        )}
      </List>
      <style jsx>{`
        @keyframes bounce {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.2);
          }
        }
        .bouncy {
          animation-direction: alternate;
          animation-duration: 1s;
          animation-iteration-count: infinite;
          animation-name: bounce;
          animation-timing-function: cubic-bezier(0.3, 0.51, 0, 1.38);
        }
      `}</style>
    </Card>
  );
};

export default Menu;
