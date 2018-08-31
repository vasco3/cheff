import { kinobodyProgramModeValues, macroValues } from './constants';

function calculateWeightCoeficient(bodyWeightIsInLbs) {
  return bodyWeightIsInLbs ? 1 : 0.45;
}

export function calculateCaloriesTotal({
  bodyWeight,
  bodyWeightIsInLbs,
  kinobodyProgramMode,
}) {
  const coeficient = calculateWeightCoeficient(bodyWeightIsInLbs);
  const caloriesPerLbs = kinobodyProgramModeValues[kinobodyProgramMode];
  return coeficient * parseInt(bodyWeight, 10) * caloriesPerLbs;
}

export function calculateProteinTotal(
  { bodyWeight, bodyWeightIsInLbs, kinobodyMacroOption },
  caloriesTotal,
) {
  const coeficient = calculateWeightCoeficient(bodyWeightIsInLbs);
  const proteinFactor = macroValues[kinobodyMacroOption] || caloriesTotal * 0.3;
  return parseInt(bodyWeight, 10) * coeficient * proteinFactor;
}
