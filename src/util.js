const { List } = require('immutable');

const CALORIES_TOLERANCE = 50; // calories
const CARBS_TOLERANCE = 10; // grams
const FAT_TOLERANCE = 10; // grams
const PROTEIN_TOLERANCE = 10; // grams

export function calculateSettings({
  CALORIES_TOTAL,
  CARBS_TOTAL,
  FAT_TOTAL,
  PROTEIN_TOTAL,
}) {
  return {
    CALORIES_LOWER_BOUND: CALORIES_TOTAL - CALORIES_TOLERANCE,
    CALORIES_UPPER_BOUND: CALORIES_TOTAL + CALORIES_TOLERANCE,
    CARBS_LOWER_BOUND: CARBS_TOTAL - CARBS_TOLERANCE,
    CARBS_UPPER_BOUND: CARBS_TOTAL + CARBS_TOLERANCE,
    FAT_LOWER_BOUND: FAT_TOTAL - FAT_TOLERANCE,
    FAT_UPPER_BOUND: FAT_TOTAL + FAT_TOLERANCE,
    PROTEIN_LOWER_BOUND: PROTEIN_TOTAL - PROTEIN_TOLERANCE,
    PROTEIN_UPPER_BOUND: PROTEIN_TOTAL + PROTEIN_TOLERANCE,
  };
}

export function randomSort() {
  if (Math.random() > 0.5) return 1;
  if (Math.random() > 0.5) return -1;
  return 0;
}

// Find the combinations of recipes that amount 2,800 cal
export function calculateDayMenu({
  calories = 0,
  carbs = 0,
  fat = 0,
  menu = List([]),
  protein = 0,
  recipeIndex = 0,
  recipes = List([]),
  consumedServings = 0,
  settings = {},
}) {
  const shouldExit = recipeIndex >= recipes.size;
  if (shouldExit) {
    const isCaloriesOutOfBounds =
      calories < settings.CALORIES_LOWER_BOUND ||
      settings.CALORIES_UPPER_BOUND < calories;

    const isCarbsOutOfBounds =
      protein < settings.CARBS_LOWER_BOUND ||
      settings.CARBS_UPPER_BOUND < carbs;

    const isFatOutOfBounds =
      protein < settings.FAT_LOWER_BOUND || settings.FAT_UPPER_BOUND < fat;

    const isProteinOutOfBounds =
      protein < settings.PROTEIN_LOWER_BOUND ||
      settings.PROTEIN_UPPER_BOUND < protein;

    const shouldRestart =
      isCaloriesOutOfBounds ||
      isCarbsOutOfBounds ||
      isFatOutOfBounds ||
      isProteinOutOfBounds;

    if (shouldRestart) {
      return calculateDayMenu({
        recipes: recipes.sort(randomSort),
        settings,
      });
    }
    return { menu: menu.toArray(), calories, protein, carbs, fat };
  }

  const recipe = recipes.get(recipeIndex) || {};
  const caloriesCounted = calories + recipe.Calories;
  const proteinCounted = protein + recipe.Protein;
  const carbsCounted = carbs + recipe.Carbs;
  const fatCounted = fat + recipe.Fat;

  const hasServingsLeft = recipe.servings - consumedServings <= 0;

  const shouldSkipRecipe =
    caloriesCounted > settings.CALORIES_UPPER_BOUND ||
    proteinCounted > settings.PROTEIN_UPPER_BOUND + 10 ||
    hasServingsLeft;

  if (shouldSkipRecipe) {
    return calculateDayMenu({
      calories,
      carbs,
      fat,
      menu,
      protein,
      recipeIndex: recipeIndex + 1,
      recipes,
      consumedServings: 0,
      settings,
    });
  }

  return calculateDayMenu({
    calories: caloriesCounted,
    carbs: carbsCounted,
    fat: fatCounted,
    menu: menu.push(recipe),
    protein: proteinCounted,
    recipeIndex,
    recipes,
    consumedServings: consumedServings + 1,
    settings,
  });
}
