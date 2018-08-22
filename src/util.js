const { List } = require('immutable');

const data = require('../data/recipes');

// find the combinations of recipes that amount 2,800 cal

const BODY_WEIGHT_LBS = 180;

const TOTAL_CALORIES = 3200;
const CALORIES_LOWER_BOUND = TOTAL_CALORIES - 50;
const CALORIES_UPPER_BOUND = TOTAL_CALORIES + 50;
const PROTEIN_UPPER_BOUND = 1 * BODY_WEIGHT_LBS;

export function randomSort() {
  if (Math.random() > 0.5) return 1;
  if (Math.random() > 0.5) return -1;
  return 0;
}

export function calculateDayMenu({
  menu = List([]),
  recipes = List([]),
  recipeIndex = 0,
  calories = 0,
  protein = 0,
}) {
  const shouldExit = recipeIndex >= recipes.size;
  if (shouldExit) {
    const shouldRestart = calories < CALORIES_LOWER_BOUND;
    if (shouldRestart) {
      return calculateDayMenu({
        recipes: List(data).sort(randomSort),
      });
    }
    return { menu: menu.toArray(), calories, protein };
  }

  const recipe = recipes.get(recipeIndex) || {};
  const caloriesCounted = calories + recipe.Calories;
  const proteinCounted = protein + recipe.Protein;
  const remainingServings = recipe.servings - 1;

  const shouldSkipRecipe =
    caloriesCounted > CALORIES_UPPER_BOUND ||
    proteinCounted > PROTEIN_UPPER_BOUND ||
    recipe.servings === 0;

  if (shouldSkipRecipe) {
    return calculateDayMenu({
      menu,
      recipes,
      recipeIndex: recipeIndex + 1,
      calories,
      protein,
    });
  }

  const recipeUpdated = { ...recipe, servings: remainingServings };

  return calculateDayMenu({
    menu: menu.push(recipe),
    recipes: recipes.update(recipeIndex, () => recipeUpdated),
    recipeIndex,
    calories: caloriesCounted,
    protein: proteinCounted,
  });
}

// const dayMenu = calculateDayMenu({
//   recipes: List(data.sort(randomSort)),
// });

// console.log(JSON.stringify(dayMenu, null, 4));
