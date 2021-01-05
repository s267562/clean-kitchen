import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBe2CiXG79mMCySAXfcH76UJaiEiy1gr8Q",
  authDomain: "clean-kitchen.firebaseapp.com",
  databaseURL: "https://clean-kitchen-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "clean-kitchen",
  storageBucket: "clean-kitchen.appspot.com",
  messagingSenderId: "769000444693",
  appId: "1:769000444693:web:ee11ba7eb3bbe1d6968f1c",
};

var fire = firebase.initializeApp(firebaseConfig);

async function db_getAllRecipes() {
  var recipes = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  return recipes;
}

async function db_getRecipeBy_id(id) {
  var recipes = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  recipes.map((recipe) => {
    if (recipe.id == id) {
      return recipe;
    }
  });
}

async function db_getRecipesBy_category(category) {
  var recipes = [];
  var requestedRecipes = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  recipes.map((recipe) => {
    if (recipe.category == category) {
      requestedRecipes.push(recipe);
    }
  });

  return requestedRecipes;
}

async function db_getRecipesBy_section(section) {
  var recipes = [];
  var requestedRecipes = [];
  var recipeSection = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  recipes.map((recipe) => {
    recipeSection = recipe.section;

    recipeSection.map((r) => {
      if (r == section) {
        requestedRecipes.push(recipe);
      }
    });
  });

  return requestedRecipes;
}

async function db_getRecipesBy_keyword(keyword) {
  var recipes = [];
  var requestedRecipes = [];
  var recipeKeys = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  recipes.map((recipe) => {
    recipeKeys = recipe.keywords;

    recipeKeys.map((key) => {
      if (key == keyword) {
        requestedRecipes.push(recipe);
      }
    });
  });

  return requestedRecipes;
}

async function db_getRecipesBy_search(str) {
  var recipes = [];
  var requestedRecipes = [];

  await fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => {
      recipes = snapshot.val();
    });

  recipes.map((recipe) => {
    if (recipe.title.toLowerCase().includes(str.toLowerCase())) {
      requestedRecipes.push(recipe);
    }
  });

  return requestedRecipes;
}

export {
  db_getAllRecipes,
  db_getRecipeBy_id,
  db_getRecipesBy_category,
  db_getRecipesBy_section,
  db_getRecipesBy_keyword,
  db_getRecipesBy_search,
};
