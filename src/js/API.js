/* temporary solution: use CSV file */
const URL = '/res/json/'; // TODO change to backend url
const RECIPES = 'recipes.json'; // TODO change to 'recipes' (?)
const SEARCHES = 'searches.json'; // TODO change to 'searches' (?)

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

    return getRecipes()
        .then((recipes) => {
            console.log(recipes);
            return recipes
                    .filter( recipe => recipe.id === recipeId)
                    [0];
        });
}

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

const API = { getRecipe, getRecipes, };
export default API;
