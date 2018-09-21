const { List } = require('immutable');

const CALORIES_TOLERANCE = 200; // calories
const CARBS_TOLERANCE = 100; // grams
const FAT_TOLERANCE = 10; // grams
const PROTEIN_TOLERANCE = 10; // grams

export function calculateSettings({ calories, carbs, fat, protein }) {
  return {
    CALORIES_LOWER_BOUND: calories - CALORIES_TOLERANCE,
    CALORIES_UPPER_BOUND: calories + CALORIES_TOLERANCE,
    CARBS_LOWER_BOUND: carbs - CARBS_TOLERANCE,
    CARBS_UPPER_BOUND: carbs + CARBS_TOLERANCE,
    FAT_LOWER_BOUND: fat - FAT_TOLERANCE,
    FAT_UPPER_BOUND: fat + FAT_TOLERANCE,
    PROTEIN_LOWER_BOUND: protein - PROTEIN_TOLERANCE,
    PROTEIN_UPPER_BOUND: protein + PROTEIN_TOLERANCE,
  };
}

export function randomSort() {
  if (Math.random() > 0.5) return 1;
  if (Math.random() > 0.5) return -1;
  return 0;
}

export function prioritizeAndSort(recipes, recipesFavoriteKeys) {
  const favoriteKeys = recipes.filter(
    filterFavoriteRecipes(recipesFavoriteKeys),
  );
  const nonFavorite = recipes
    .filterNot(filterFavoriteRecipes(recipesFavoriteKeys))
    .sort(randomSort);
  return favoriteKeys.concat(nonFavorite);
}

function filterFavoriteRecipes(recipesFavoriteKeys) {
  return recipe => recipesFavoriteKeys.has(recipe._key);
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
  recipesFavoriteKeys,
  consumedServings = 0,
  settings = {},
}) {
  const shouldExit = recipeIndex >= recipes.size;

  if (shouldExit) {
    const isCaloriesOutOfBounds =
      calories < settings.CALORIES_LOWER_BOUND ||
      settings.CALORIES_UPPER_BOUND < calories;

    const isCarbsOutOfBounds =
      carbs < settings.CARBS_LOWER_BOUND || settings.CARBS_UPPER_BOUND < carbs;

    const isFatOutOfBounds =
      fat < settings.FAT_LOWER_BOUND || settings.FAT_UPPER_BOUND < fat;

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
        recipes: prioritizeAndSort(recipes, recipesFavoriteKeys),
        recipesFavoriteKeys,
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
    carbsCounted > settings.CARBS_UPPER_BOUND ||
    fatCounted > settings.FAT_UPPER_BOUND ||
    proteinCounted > settings.PROTEIN_UPPER_BOUND ||
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
      recipesFavoriteKeys,
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
    recipesFavoriteKeys,
    consumedServings: consumedServings + 1,
    settings,
  });
}
