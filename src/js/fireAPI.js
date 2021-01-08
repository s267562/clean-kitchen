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

async function getAllRecipes() {
  return fire
    .database()
    .ref("recipes")
    .once("value")
    .then((snapshot) => snapshot.val());
}

async function getRecipeBy_id(id) {
  return getAllRecipes().then((recipes) => {
    return recipes.filter((recipe) => {
      // filter recipes by id --> only one result (unique id)
      return recipe.id === id;
    })[0]; // return the first (and unique) value
  });
}

async function getRecipesBy_keyword(k) {
  const keyword = k.toLowerCase();
  return getAllRecipes().then((recipes) => {
    return recipes.filter((recipe) => {
      let filteredKeywords = recipe.keywords?.filter((key) => key.includes(keyword));
      return filteredKeywords.length > 0;
    });
  });
}

async function getRecipesBy_section(section) {
  return getAllRecipes().then((recipes) => {
    return recipes.filter((recipe) => {
      return recipe.section.includes(section); // recipe has the selected section in its section array
    });
  });
}

const fireAPI = { getAllRecipes, getRecipeBy_id, getRecipesBy_keyword, getRecipesBy_section };
export default fireAPI;
