# fire.js
fire.js consists of the configuration data and API functions to communicate with Firebase Database

####  db_getAllRecipes
Returns all of the existing recipes

#### db_getRecipeBy_id(id)
Returns the recipe whose id matches with the argument "id"
e.g.: The function below returns the Recipe 0
```js
db_getRecipeBy_id('r0')     
```
#### db_getRecipesBy_category(category)
Returns the recipes of the specified category.
In the database, I inserted a "category" attribute into each recipe.
This function can be integrated with the icons below the search bar. 
e.g.: if the "fish" icon is being pressed, call:
```js
db_getRecipesBy_category('fish') 
```
This returns the recipes whose category equal to "fish" -> Populate the section "Popular" only with the returned array

#### db_getRecipesBy_section(section)
Returns the recipes of the specified section.
In the database, I changed the "suggestedCategory" to "section" in order to avoid confusion with "category" attribute.
Any recipe can be belong to either only one of the sections "Popular" / "Editor" or both.
e.g.: Home page is being populated in the following way:
```js
const dbRecipesPopular = await db_getRecipesBy_section('popular');
const dbRecipesEditor  = await db_getRecipesBy_section('editor');
<HeaderSuggestion title="Popular" icon="fire.png" />
<GridSuggestion recipes={dbRecipesPopular} />
<HeaderSuggestion title="Editor's Choice" icon="choice.png" />
<GridSuggestion recipes={dbRecipesEditor} />
```
#### db_getRecipesBy_keyword(keyword)
Returns the recipes whose keywords includes the argument "keyword"
I have implemented this function considering the fact that you have placed "keywords" attribute in the database.
e.g.: If user types "chicken" in the search bar, the function returns the recipes having this keyword.
However, my suggestion would be using the latter function in search bar.

#### db_getRecipesBy_search(str)

This function searches the input "str" in the titles of recipes and returns all recipes that include this "str" in their titles.
e.g.: Each time when a user types a letter, this function is being called (like onClick) and user dynamically sees the recipes that consist the letters he/she has just typed. I think it is better than searching with keyword.
