import React, { Component } from 'react';
import numeral from 'numeral';

import { Fab } from 'rmwc/Fab';
import { Icon } from 'rmwc/Icon';
import { Typography, ListDivider } from 'rmwc';

function formatNumber(number) {
  return numeral(number).format('0');
}

function getDirection(target, total) {
  if (target === total) {
    return <Icon icon="check_circle_outline" />;
  }
  if (total === 0) {
    return;
  }
  if (target > total) {
    return <Icon icon="arrow_upward" />;
  }

  return <Icon icon="arrow_downward" />;
}

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
            <Typography use="overline">{name}</Typography>
          </div>
        </div>

        <ListDivider />

        <div className="macro mt-4">
          <Typography className="ml-4" use="headline6">
            {formatNumber(total)}g {getDirection(target, total)}
          </Typography>

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
        <style jsx>{`
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
