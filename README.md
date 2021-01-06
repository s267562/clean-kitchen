# Clean Kitchen

## Phone Setup
* Download latest Firefox Beta
* Type *about:config* in the address bar and enter

Set the following entries to **`true`**:

| Entry | Info |
|:---:|:---:|
| `device.sensors.proximity.enabled` | Enable the proximity sensor |
| `media.getusermedia.insecure.enabled` | Enable the microphone on http (if needed) |
| `media.webspeech.recognition.enable` | Enable Web Speech recognition API |
| `media.webspeech.recognition.force_enable` | Enable Web Speech recognition API |

## Development Resources
* [Web Speech API](<https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>)
* [Speech Recognition Interface](<https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition>)
* [Web Speech API Tutorial](<https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API>)
* [Web Speech API Tutorial on Github](<https://github.com/mdn/web-speech-api>)
* [Proximity Events API](<https://developer.mozilla.org/en-US/docs/Web/API/Proximity_Events>)
* [Proximity Events API Tutorial](<https://hacks.mozilla.org/2013/06/the-proximity-api/>)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# fireAPI.js
fireAPI.js consists of the configuration data and API functions to communicate with Firebase Database

####  getAllRecipes
Returns all of the existing recipes

#### getRecipeBy_id(id)
Returns the recipe whose id matches with the argument "id"
e.g.: The function below returns the Recipe 0
```js
getRecipeBy_id('r0')     
```
#### getRecipesBy_category(category) (TODO)
Returns the recipes of the specified category.
In the database, I inserted a "category" attribute into each recipe.
This function can be integrated with the icons below the search bar. 
e.g.: if the "fish" icon is being pressed, call:
```js
getRecipesBy_category('fish') 
```
This returns the recipes whose category equal to "fish" -> Populate the section "Popular" only with the returned array

#### getRecipesBy_section(section) 
Returns the recipes of the specified section.
In the database, I changed the "suggestedCategory" to "section" in order to avoid confusion with "category" attribute.
Any recipe can be belong to either only one of the sections "Popular" / "Editor" or both.
e.g.: Home page is being populated in the following way:
```js
const dbRecipesPopular = await getRecipesBy_section('popular');
const dbRecipesEditor  = await getRecipesBy_section('editor');
<HeaderSuggestion title="Popular" icon="fire.png" />
<GridSuggestion recipes={dbRecipesPopular} />
<HeaderSuggestion title="Editor's Choice" icon="choice.png" />
<GridSuggestion recipes={dbRecipesEditor} />
```
#### getRecipesBy_keyword(keyword)
Returns the recipes whose keywords includes the argument "keyword"
I have implemented this function considering the fact that you have placed "keywords" attribute in the database.
e.g.: If user types "chicken" in the search bar, the function returns the recipes having this keyword.
However, my suggestion would be using the latter function in search bar.

#### getRecipesBy_search(str) (TODO)

This function searches the input "str" in the titles of recipes and returns all recipes that include this "str" in their titles.
e.g.: Each time when a user types a letter, this function is being called (like onClick) and user dynamically sees the recipes that consist the letters he/she has just typed. I think it is better than searching with keyword.