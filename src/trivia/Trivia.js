import React from 'react';
import immer from 'immer';
import { Fab } from 'rmwc/Fab';
import { Card } from 'rmwc/Card';
import { ListDivider } from 'rmwc/List';
import { Typography } from 'rmwc/Typography';

import { withCoreContext } from '../CoreContext';

import Macro from './Macro';

const DECREMENT = 1;
const INCREMENT_LOW = 5;
const INCREMENT_HIGH = 10;

function calculateIdealAttempts(macro, attempts = 0) {
  if (macro === 0) return attempts;

  const totalAttempts = attempts + 1;

  const macroIfAddLow = macro - INCREMENT_LOW;
  const macroIfAddHigh = macro - INCREMENT_HIGH;
  const macroIfSubtract = macro + DECREMENT;

  const doneIfAddLow = macroIfAddLow === 0;
  const doneIfAddHigh = macroIfAddHigh === 0;
  const doneIfSubtract = macroIfSubtract === 0;

  if (doneIfAddLow || doneIfAddHigh || doneIfSubtract) return totalAttempts;

  if (macroIfAddHigh >= INCREMENT_HIGH) {
    return calculateIdealAttempts(macroIfAddHigh, totalAttempts);
  }
  if (macroIfAddLow >= INCREMENT_LOW) {
    return calculateIdealAttempts(macroIfAddLow, totalAttempts);
  }

  const calcs = [macroIfAddLow, macroIfAddHigh, macroIfSubtract].filter(
    n => n > -1 * INCREMENT_LOW,
  );
  const macroRemaining = Math.min.apply(null, calcs);

  if (macroRemaining < 0) return totalAttempts - macroRemaining;

  return calculateIdealAttempts(macroRemaining, totalAttempts);
}
function calculatePoints({ attempts, macros }) {
  const idealAttemptsForCarbs = calculateIdealAttempts(macros.Carbs);
  const idealAttemptsForFat = calculateIdealAttempts(macros.Fat);
  const idealAttemptsForProtein = calculateIdealAttempts(macros.Protein);

  const ideal =
    idealAttemptsForCarbs + idealAttemptsForFat + idealAttemptsForProtein;

  const delta = attempts - ideal;

  if (delta === 0) {
    return 100;
  }
  if (delta < 5) {
    return 50;
  }
  if (delta < 10) {
    return 10;
  }
  return 1;
}

function checkWinner({ macros, tracker }) {
  return (
    macros.Carbs === tracker.carbs &&
    macros.Protein === tracker.protein &&
    macros.Fat === tracker.fat
  );
}

class Trivia extends React.Component {
  state = {
    attempts: 0,
    recipeIndex: 0,
    points: 0,
    tracker: { carbs: 0, fat: 0, protein: 0 },
  };

  handleTracker = ({ action, macro, value }) => {
    this.setState(prevState =>
      immer(prevState, draftState => {
        switch (action) {
          case 'advance':
            draftState.tracker = { carbs: 0, fat: 0, protein: 0 };
            draftState.recipeIndex =
              this.props.recipes.size > draftState.recipeIndex
                ? draftState.recipeIndex + 1
                : 0;
            draftState.attempts = 0;
            draftState.points += calculatePoints({
              attempts: prevState.attempts,
              macros: value,
            });
            break;
          case 'add':
            draftState.tracker[macro] += value;
            draftState.attempts += 1;
            break;
          case 'subtract':
            draftState.tracker[macro] -= value;
            draftState.attempts += 1;
            break;
          default:
            break;
        }
        return draftState;
      }),
    );
  };

  render() {
    const { points, recipeIndex, tracker = {} } = this.state;

    const macrosRaw = this.props.recipes.get(recipeIndex) || {};
    const macros = {
      name: macrosRaw.name,
      Carbs: Math.round(macrosRaw.Carbs),
      Fat: Math.round(macrosRaw.Fat),
      Protein: Math.round(macrosRaw.Protein),
    };

    return (
      <div className="plan">
        <div className="banner text-center">
          <Typography use="subtitle1" theme="onSecondary">
            Score {points}
          </Typography>
        </div>
        <Card outlined>
          <div className="flex justify-between px-4 py-6 items-center">
            <Typography use="headline5">{macros.name}</Typography>
          </div>
          <ListDivider />

          <Macro
            decrement={DECREMENT}
            incrementLow={INCREMENT_LOW}
            incrementHigh={INCREMENT_HIGH}
            name="carbs"
            target={macros.Carbs}
            total={tracker.carbs}
            onAction={this.handleTracker}
          />
          <Macro
            decrement={DECREMENT}
            incrementLow={INCREMENT_LOW}
            incrementHigh={INCREMENT_HIGH}
            name="protein"
            target={macros.Protein}
            total={tracker.protein}
            onAction={this.handleTracker}
          />
          <Macro
            decrement={DECREMENT}
            incrementLow={INCREMENT_LOW}
            incrementHigh={INCREMENT_HIGH}
            name="fat"
            target={macros.Fat}
            total={tracker.fat}
            onAction={this.handleTracker}
          />
          {checkWinner({ macros, tracker }) && (
            <Fab
              icon="favorite"
              label="Nailed It!"
              onClick={() =>
                this.handleTracker({ action: 'advance', value: macros })
              }
            />
          )}
        </Card>
        <style jsx>{`
          .banner {
            background-color: var(--mdc-theme-secondary);
          }
          .plan {
            touch-action: manipulation;
          }
        `}</style>
      </div>
    );
  }
}

export default withCoreContext(Trivia);
