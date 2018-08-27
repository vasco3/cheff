import React from 'react';
import { Card } from 'rmwc/Card';
import { Fab } from 'rmwc/Fab';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';
import { List, SimpleListItem } from 'rmwc/List';
import numeral from 'numeral';

import CoreContext from '../CoreContext';

const Plan = () => {
  return (
    <CoreContext.Consumer>
      {context => {
        const {
          menu = [],
          menuCaloriesTotal,
          menuCarbsTotal,
          menuFatTotal,
          menuProteinTotal,
          handleMenuGenerate,
        } = context;
        return (
          <Card outlined>
            <Typography use="subtitle1" tag="div" className="p-4">
              Day Meal Plan {menu.length > 0 && `(${menu.length} servings)`}
            </Typography>
            <ListDivider />

            <Typography
              use="subtitle2"
              theme="text-secondary-on-background"
              className="px-4 py-2"
            >
              {numeral(menuCaloriesTotal).format('0,0')} cal, protein{' '}
              {menuProteinTotal} g, carbs {menuCarbsTotal} g, fat {menuFatTotal}{' '}
              g
            </Typography>

            <ListDivider />

            <List twoLine dense>
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

            <div className="flex justify-end pr-4 py-4">
              <Fab onClick={handleMenuGenerate} icon="autorenew" />
            </div>
          </Card>
        );
      }}
    </CoreContext.Consumer>
  );
};

export default Plan;
