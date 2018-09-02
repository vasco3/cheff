import React, { Component } from 'react';
import numeral from 'numeral';

function formatNumber(number, format) {
  return numeral(number).format(format || '0');
}
class Preview extends Component {
  state = {};
  render() {
    const { calories, carbs, fat, protein } = this.props;
    return (
      <div className="m-4">
        calories {formatNumber(calories, '0,0')}, carbs {formatNumber(carbs)}
        g, fat {formatNumber(fat)}
        g, protein {formatNumber(protein)}g
      </div>
    );
  }
}

export default Preview;
