import React, { Component } from 'react';
import numeral from 'numeral';

import { Typography } from 'rmwc';

// import colors from './colors';
import MacroRing from './MacroRing';

class Macro extends Component {
  state = {};
  render() {
    const { name, target, total } = this.props;
    const percent = numeral(total / target).format('0 %');
    return (
      <div className="flex items-center">
        <MacroRing name={name} total={total} target={target} />
        <div>
          <Typography use="subtitle1">{name}</Typography>{' '}
          <Typography use="caption">{percent}</Typography>
          <Typography use="body1" tag="div">
            {total} / {target} g
          </Typography>
        </div>
      </div>
    );
  }
}

export default Macro;
