import React, { Component } from 'react';
import numeral from 'numeral';
import { List, SimpleListItem } from 'rmwc/List';

function formatNumber(number, format) {
  return numeral(number).format(format || '0');
}
class Preview extends Component {
  state = {};
  render() {
    const { bodyWeightLbs, calories, carbs, fat, protein } = this.props;
    return (
      <List>
        <SimpleListItem graphic="trip_origin">
          {formatNumber(calories / bodyWeightLbs, '0,0')} cal / body-lb
        </SimpleListItem>
        <SimpleListItem graphic="trip_origin">
          {formatNumber(calories, '0,0')} cal
        </SimpleListItem>
        <SimpleListItem graphic="trip_origin">
          Carbs {formatNumber(carbs)}g
        </SimpleListItem>
        <SimpleListItem graphic="trip_origin">
          Fat {formatNumber(fat)} g
        </SimpleListItem>
        <SimpleListItem graphic="trip_origin">
          Protein {formatNumber(protein)}g
        </SimpleListItem>
      </List>
    );
  }
}

export default Preview;
