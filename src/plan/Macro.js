import React, { Component } from 'react';
import numeral from 'numeral';
import upperFirst from 'lodash/upperFirst';

import { Fab } from 'rmwc/Fab';
import { Typography } from 'rmwc';

import MacroRing from './MacroRing';

class Macro extends Component {
  state = {};
  render() {
    const { increment, onAction, name, target, total } = this.props;
    const percent = numeral(total / target).format('0 %');
    return (
      <div className="macro pr-4">
        <MacroRing name={name} total={total} target={target} />
        <div>
          <Typography use="subtitle1">{upperFirst(name)}</Typography>{' '}
          <Typography use="caption">{percent}</Typography>
          <Typography use="body1" tag="div">
            {total} / {target} g
          </Typography>
        </div>
        <Fab
          onClick={function handleMacroAction() {
            onAction({ action: 'add', macro: name, value: increment });
          }}
          label={`${increment}g`}
          icon="add"
        />
        <style jsx>{`
          .macro {
            display: grid;
            grid-template-columns: auto 1fr auto;
            grid-column-gap: 1rem;
          }
        `}</style>
      </div>
    );
  }
}

export default Macro;
