const { List } = require('immutable');

export function calculateSettings({
  BODY_WEIGHT_LBS,
  CALORIES_TOLERANCE,
  PROTEIN_PER_BODY_LB,
  TOTAL_CALORIES,
}) {
  return {
    CALORIES_LOWER_BOUND: TOTAL_CALORIES - CALORIES_TOLERANCE,
    CALORIES_UPPER_BOUND: TOTAL_CALORIES + CALORIES_TOLERANCE,
    PROTEIN_UPPER_BOUND: PROTEIN_PER_BODY_LB * BODY_WEIGHT_LBS,
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
    const shouldRestart =
      calories > settings.CALORIES_UPPER_BOUND ||
      calories < settings.CALORIES_LOWER_BOUND ||
      protein > settings.PROTEIN_UPPER_BOUND + 10 ||
      protein < settings.PROTEIN_UPPER_BOUND - 10;

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

  const shouldSkipRecipe =
    caloriesCounted > settings.CALORIES_UPPER_BOUND ||
    proteinCounted > settings.PROTEIN_UPPER_BOUND + 10 ||
    recipe.servings - consumedServings === 0;

  if (shouldSkipRecipe) {
    return calculateDayMenu({
      calories,
      carbs,
      fat,
      menu,
      protein,
      recipeIndex: recipeIndex + 1,
      recipes,
      consumedServings,
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
