import React, { Component } from 'react';
import { XYPlot, ArcSeries } from 'react-vis';

import colors from './colors';

const radius1 = {
  radius0: 1,
  radius: 1.5,
};
const radius2 = {
  radius0: 1.6,
  radius: 2.1,
};
const radius3 = {
  radius0: 2.2,
  radius: 2.7,
};
const radius4 = {
  radius0: 2.8,
  radius: 3.3,
};
function calculateData({ calories, carbs, fat, protein }) {
  return [
    { ...radius1, time: 2 * Math.PI, color: 'silver' },
    {
      ...radius1,
      time: (fat.total / fat.target) * 2 * Math.PI,
      color: colors.fat,
    },
    { ...radius2, time: 2 * Math.PI, color: 'silver' },
    {
      ...radius2,
      time: (protein.total / protein.target) * 2 * Math.PI,
      color: colors.protein,
    },
    { ...radius3, time: 2 * Math.PI, color: 'silver' },
    {
      ...radius3,
      time: (carbs.total / carbs.target) * 2 * Math.PI,
      color: colors.carbs,
    },
    { ...radius4, time: 2 * Math.PI, color: 'silver' },
    {
      ...radius4,
      time: (calories.total / calories.target) * 2 * Math.PI,
      color: colors.calories,
    },
  ];
}

class MacrosRings extends Component {
  state = {};
  render() {
    const data = calculateData(this.props);
    return (
      <XYPlot
        xDomain={[-4, 4]}
        yDomain={[-4, 4]}
        height={240}
        width={240}
        getAngle={d => d.time}
        getAngle0={0}
      >
        <ArcSeries
          animation={{ damping: 9, stiffness: 300 }}
          radiusDomain={[0, 4]}
          data={data}
          colorType="literal"
        />
      </XYPlot>
    );
  }
}

export default MacrosRings;
