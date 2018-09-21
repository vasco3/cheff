import React, { Component } from 'react';
import { XYPlot, ArcSeries } from 'react-vis';

import colors from './colors';

const ring = {
  radius0: 3,
  radius: 3.5,
};

function calculateData({ name, total, target }) {
  const hasSurplus = total > target;

  const achieved = hasSurplus ? 1 : total / target;

  const ringSurplus = hasSurplus ? total / target - 1 : 0;

  return [
    { ...ring, amount: 2 * Math.PI, color: 'silver' },
    {
      ...ring,
      amount: achieved * 2 * Math.PI,
      color: colors[name],
    },
    {
      ...ring,
      amount: ringSurplus * 2 * Math.PI,
      color: ringSurplus ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)',
    },
  ];
}

const REM = 16;
const dimension = REM * 4;
class MacroRing extends Component {
  state = {};
  render() {
    const data = calculateData(this.props);

    return (
      <XYPlot
        xDomain={[-1, 1]}
        yDomain={[-1, 1]}
        height={dimension}
        width={dimension}
        getAngle={d => d.amount}
        getAngle0={0}
      >
        <ArcSeries
          animation={{ damping: 9, stiffness: 300 }}
          radiusDomain={[0, 1]}
          center={{ x: -2, y: -2 }}
          data={data}
          colorType="literal"
        />
      </XYPlot>
    );
  }
}

export default MacroRing;
