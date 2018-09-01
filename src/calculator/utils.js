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

export const FAT_CALORIES_PER_GRAM = 9;
export const CARBS_CALORIES_PER_GRAM = 4;
export const PROTEIN_CALORIES_PER_GRAM = 4;

export function calculateCarbsTotal({ caloriesTotal, fatTotal, proteinTotal }) {
  const caloriesRemaining =
    caloriesTotal -
    fatTotal * FAT_CALORIES_PER_GRAM -
    proteinTotal * PROTEIN_CALORIES_PER_GRAM;
  const carbsTotal = caloriesRemaining / CARBS_CALORIES_PER_GRAM;
  return carbsTotal;
}

export function calculateFatTotal(caloriesTotal) {
  const fatTotal = (caloriesTotal * 0.25) / FAT_CALORIES_PER_GRAM;
  return fatTotal;
}
