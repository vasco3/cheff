import {
  FAT_CALORIES_PER_GRAM,
  CARBS_CALORIES_PER_GRAM,
  PROTEIN_CALORIES_PER_GRAM,
} from './constants';

export function calculateProtein({ bodyWeight, proteinGramsPerBodyWeightLb }) {
  return parseInt(bodyWeight, 10) * parseFloat(proteinGramsPerBodyWeightLb, 10);
}

export function convertMacroGramToCalories({ macro, value }) {
  switch (macro) {
    case 'carbs':
      return value * CARBS_CALORIES_PER_GRAM;
    case 'fat':
      return value * FAT_CALORIES_PER_GRAM;
    case 'protein':
      return value * PROTEIN_CALORIES_PER_GRAM;
  }
  return value;
}

export function calculateCarbs({ calories, fat, protein }) {
  const caloriesRemaining =
    calories -
    fat * FAT_CALORIES_PER_GRAM -
    protein * PROTEIN_CALORIES_PER_GRAM;
  const carbs = caloriesRemaining / CARBS_CALORIES_PER_GRAM;
  return Math.round(carbs);
}

export function calculateFat(calories, fatCaloriesRatio) {
  const fat =
    (parseInt(calories, 10) * (parseInt(fatCaloriesRatio, 10) / 100)) /
    FAT_CALORIES_PER_GRAM;
  return Math.round(fat);
}

export function computeMacros(values, forWorkout) {
  const calories = forWorkout
    ? +values.calories + +values.caloriesExtraForWorkoutDay
    : +values.calories;
  const fat = calculateFat(calories, values.fatCaloriesRatio);
  const protein = calculateProtein(values, calories);
  const carbs = calculateCarbs({ calories, fat, protein });
  return { calories, carbs, fat, protein };
}
