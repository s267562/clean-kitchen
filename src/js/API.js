/* temporary solution: use CSV file */
const URL = "/res/json/"; // TODO change to backend url
const RECIPES = "recipes.json"; // TODO change to 'recipes' (?)

async function getRecipes() {
  const url = `${URL}${RECIPES}`;
  const response = await fetch(url);
  const recipes = await response.json();
  if (response.ok) {
    return recipes.recipes; // TODO remove .recipes
  } else {
    let err = { status: response.status, errorObj: recipes };
    throw err;
  }
}

async function getRecipe(recipeId) {
  // const url = `${URL}/recipe/` + recipeId;
  // const response = await fetch(url);
  // const recipe = await response.json();
  // if (response.ok) {
  //     return recipe;
  // } else {
  //     let err = { status: response.status, errorObj: recipe };
  //     throw err;
  // }

  return getRecipes().then((recipes) => {
    return recipes.filter((recipe) => recipe.id === recipeId)[0];
  });
}

async function getSearchResults(keyword) {
  // const url = `${URL}/searchRecipes/` + keyword;
  // const response = await fetch(url);
  // const recipes = await response.json();
  // if (response.ok) {
  //     return recipes;
  // } else {
  //     let err = { status: response.status, errorObj: recipe };
  //     throw err;
  // }

  return getRecipes().then((recipes) => {
    let results = recipes.filter((recipe) => {
      let filteredKeywords = recipe.keywords.filter((k) => k.includes(keyword));
      return filteredKeywords.length > 0;
    });

    return results;
  });
}

async function getSuggestedRecipes(category) {
  return getRecipes().then((recipes) => {
    let suggestedRecipes = recipes.filter((recipe) => {
      let isSuggested = recipe.suggestedCategory.includes(category);
      return isSuggested;
    });

    return suggestedRecipes;
  });
}

const API = { getRecipe, getRecipes, getSearchResults, getSuggestedRecipes };
export default API;
