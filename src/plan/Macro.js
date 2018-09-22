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
  render() {
    const {
      decrement,
      incrementLow,
      incrementHigh,
      onAction,
      name,
      target,
      total,
    } = this.props;
    return (
      <div className="mb-4">
        <div className="title px-4">
          <div>
            <Typography use="headline6">
              {formatNumber(target - total)}g
            </Typography>
            <Typography use="caption"> to {formatNumber(target)}g</Typography>
          </div>
          <Typography use="overline" className="pl-4">
            {upperFirst(name)}
          </Typography>
        </div>

        <ListDivider />

        <div className="macro mt-4">
          <div className="chart">
            <MacroRing name={name} total={total} target={target} />

            <Typography className={className} use="caption">
              {formatNumber(total)}g
            </Typography>
          </div>

          <div>
            <Fab
              className="mr-2"
              onClick={function handleMacroActionRemove() {
                onAction({ action: 'subtract', macro: name, value: decrement });
              }}
              label={`${decrement}`}
              icon="remove"
            />
            <Fab
              className="mr-2"
              onClick={function handleMacroActionAddLow() {
                onAction({ action: 'add', macro: name, value: incrementLow });
              }}
              label={`${incrementLow}`}
              icon="add"
            />
            <Fab
              className="mr-2"
              onClick={function handleMacroActionAddHigh() {
                onAction({ action: 'add', macro: name, value: incrementHigh });
              }}
              label={`${incrementHigh}`}
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
          .title {
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }
}

export default Macro;
