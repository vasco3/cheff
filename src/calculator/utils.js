import { kinobodyProgramModeValues, macroValues } from './constants';

function calculateWeightCoeficient(bodyWeightIsInLbs) {
  return bodyWeightIsInLbs ? 1 : 0.45;
}

export function calculateCalories(
  { bodyWeight, bodyWeightIsInLbs, kinobodyProgramMode },
  forWorkout = false,
) {
  const coeficient = calculateWeightCoeficient(bodyWeightIsInLbs);
  const caloriesPerLbs = kinobodyProgramModeValues[kinobodyProgramMode];
  const baseCalories = coeficient * parseInt(bodyWeight, 10) * caloriesPerLbs;
  const surplus = forWorkout ? 500 : 100;
  return Math.round(baseCalories + surplus);
}

export function calculateProtein(
  { bodyWeight, bodyWeightIsInLbs, kinobodyMacroOption },
  calories,
) {
  const coeficient = calculateWeightCoeficient(bodyWeightIsInLbs);
  const proteinFactor = macroValues[kinobodyMacroOption] || calories * 0.3;
  return parseInt(bodyWeight, 10) * coeficient * proteinFactor;
}

export const FAT_CALORIES_PER_GRAM = 9;
export const CARBS_CALORIES_PER_GRAM = 4;
export const PROTEIN_CALORIES_PER_GRAM = 4;

export function calculateCarbs({ calories, fat, protein }) {
  const caloriesRemaining =
    calories -
    fat * FAT_CALORIES_PER_GRAM -
    protein * PROTEIN_CALORIES_PER_GRAM;
  const carbs = caloriesRemaining / CARBS_CALORIES_PER_GRAM;
  return Math.round(carbs);
}

export function calculateFat(calories) {
  const fat = (calories * 0.25) / FAT_CALORIES_PER_GRAM;
  return Math.round(fat);
}

export function computeMacros(values, forWorkout) {
  const calories = calculateCalories(values, forWorkout);
  const fat = calculateFat(calories);
  const protein = calculateProtein(values, calories);
  const carbs = calculateCarbs({ calories, fat, protein });
  return { calories, carbs, fat, protein };
}
