import React, { Component } from 'react';
import numeral from 'numeral';
import upperFirst from 'lodash/upperFirst';
import css from 'styled-jsx/css';

import { Fab } from 'rmwc/Fab';
import { Typography, ListDivider } from 'rmwc';

import MacroRing from './MacroRing';

function formatNumber(number) {
  return numeral(number).format('0');
}

const { className, styles } = css.resolve`span {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}`;

class Macro extends Component {
  state = {};
  render() {
    const { decrement, increment, onAction, name, target, total } = this.props;
    const percent = numeral(total / target).format('0%');
    return (
      <div>
        <Typography use="overline" className="pl-4">
          {upperFirst(name)}
        </Typography>{' '}
        <Typography use="body1">
          {formatNumber(target - total)} to {formatNumber(target)}g
        </Typography>
        <ListDivider />
        <div className="macro">
          <div className="chart">
            <MacroRing name={name} total={total} target={target} />

            <Typography className={className} use="caption">
              {percent}
            </Typography>
          </div>

          <div>
            <Fab
              className="mr-4"
              onClick={function handleMacroActionRemove() {
                onAction({ action: 'subtract', macro: name, value: decrement });
              }}
              label={`${decrement}`}
              icon="remove"
            />
            <Fab
              className="mr-4"
              onClick={function handleMacroActionAdd() {
                onAction({ action: 'add', macro: name, value: increment });
              }}
              label={`${increment}`}
              icon="add"
            />
          </div>
        </div>
        {styles}
        <style jsx>{`
          .chart {
            position: relative;
          }
          .macro {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }
}

export default Macro;
