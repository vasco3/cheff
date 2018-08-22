const { List } = require('immutable');
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc';

import { calculateDayMenu, randomSort } from './util';

const Menu = props => {
  const dayMenu = calculateDayMenu({
    recipes: List(props.recipes.sort(randomSort)),
  });

  return (
    <div>
      <Typography use="overline">
        Menu
        <ListDivider />
      </Typography>

      {JSON.stringify(dayMenu, null, 4)}
    </div>
  );
};

export default Menu;
