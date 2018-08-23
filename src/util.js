const { List } = require('immutable');

const data = require('../data/recipes');

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
  menu = List([]),
  recipes = List([]),
  recipeIndex = 0,
  calories = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  settings = {},
}) {
  const shouldExit = recipeIndex >= recipes.size;
  if (shouldExit) {
    const shouldRestart = calories < settings.CALORIES_LOWER_BOUND;
    if (shouldRestart) {
      return calculateDayMenu({
        recipes: List(data).sort(randomSort),
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

  const remainingServings = recipe.servings - 1;

  const shouldSkipRecipe =
    caloriesCounted > settings.CALORIES_UPPER_BOUND ||
    proteinCounted > settings.PROTEIN_UPPER_BOUND ||
    recipe.servings === 0;

  if (shouldSkipRecipe) {
    return calculateDayMenu({
      calories,
      carbs,
      fat,
      menu,
      protein,
      recipeIndex: recipeIndex + 1,
      recipes,
      settings,
    });
  }

  const recipeUpdated = { ...recipe, servings: remainingServings };

  return calculateDayMenu({
    menu: menu.push(recipe),
    recipes: recipes.update(recipeIndex, () => recipeUpdated),
    recipeIndex,
    calories: caloriesCounted,
    protein: proteinCounted,
    carbs: carbsCounted,
    fat: fatCounted,
    settings,
  });
}
