import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Box } from "@material-ui/core";
import fireAPI from "./fireAPI";
import Grow from "@material-ui/core/Grow";
import LoadingComponent from "./LoadingComponent";

function newGradient(name) {
  var backgroundGradient = null;

  switch (name) {
    case "breakfast":
      backgroundGradient = "radial-gradient(at top left, rgb(244, 200, 31), rgb(91, 34, 0))";
      break;
    case "fish":
      backgroundGradient = "radial-gradient(at top left, rgb(15, 187, 194), rgb(58, 82, 194))";
      break;
    case "meat":
      backgroundGradient = "radial-gradient(at top left, rgb(247, 147, 42), rgb(157, 2, 2))";
      break;
    case "vegan":
      backgroundGradient = "radial-gradient(at top left, rgb(56, 230, 118), rgb(18, 52, 53))";
      break;
    case "dessert":
      backgroundGradient = "radial-gradient(at top left, rgb(13, 245, 169), rgb(160, 143, 247))";
      break;

    default:
      break;
  }

  return backgroundGradient;
}

const useStyles = makeStyles({
  rootGridScrollView: {
    overflowY: "hidden",
    overflowX: "hidden",
    alignItems: "safe center",
  },
  scrollViewCategory: {
    justifyContent: "space-between",
    flexFlow: "row",
    overflowX: "scroll",
    scrollbarWidth: "none",
    paddingTop: 8,
    paddingBottom: 8,
  },
  cardCategory: {
    width: 65,
    height: 65,
    margin: 8,
    padding: 8,
    borderRadius: 18,
    minWidth: 48,
    //background: newGradient,
    /*background: `radial-gradient(circle, rgba(251,179,63,0.9415967070421919) 0%, rgba(252,70,107,1) 100%)`,*/
    /*backgroundColor: "rgb(63,94,251)", /*this your primary color*/
  },
  mediaCategory: {
    height: 44,
    padding: 4,
  },
  contentCategory: {
    padding: 0,
    textAlign: "center",
  },
  textCategory: {
    color: "#FFFFFF",
    margin: 0,
    fontSize: "0.7rem",
    marginBottom: "0.35em",
  },
  scrollViewSuggestion: {
    flexFlow: "row",
    overflowX: "scroll",
    scrollbarWidth: "none",
    padding: 8,
  },
  cardSuggestion: {
    minWidth: 300,
    height: 185,
    position: "relative",
    margin: 8,
    borderRadius: 12,
    "&:after": {
      content: '""',
      display: "block",
      position: "absolute",
      width: "100%",
      height: "70%",
      bottom: 0,
      zIndex: 1,
      background: "linear-gradient(to top, #000, rgba(0,0,0,0))",
    },
  },
  mediaSuggestion: {
    height: "100%",
  },
  contentSuggestion: {
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    width: "100%",
  },
  textSuggestion: {
    color: "#FFFFFF",
    margin: 0,
    flexWrap: 1,
  },
  headerSuggestion: {
    display: "flex",
    alignItems: "center",
    flexGrow: 0,
    paddingLeft: 8,
    flexFlow: "row",
  },
});

function Home() {
  const [popularRecipes, setPopularRecipes] = useState(null);
  const [editorRecipes, setEditorRecipes] = useState(null);

  useEffect(() => {
    fireAPI.getRecipesBy_section("popular").then((recipes) => {
      //console.log(recipes);
      setPopularRecipes(recipes);
    });

    fireAPI.getRecipesBy_section("editor").then((recipes) => {
      //console.log(recipes);
      setEditorRecipes(recipes);
    });
  }, []);

  if (popularRecipes === null || editorRecipes === null) {
    return <LoadingComponent />;
  } else {
    return (
      <>
        <GridCategory />
        <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px" }}>
          <HeaderSuggestion title='Popular' icon='fire.png' />
          <GridSuggestion recipes={popularRecipes} recipe='Pasta alla Carbonara' img='carbonara.jpg' />
        </Paper>
        <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px" }}>
          <HeaderSuggestion title="Editor's Choice" icon='choice.png' />
          <GridSuggestion recipes={editorRecipes} recipe='Cheesecake' img='cheesecake.jpg' />
        </Paper>
      </>
    );
  }
}

function CardCategory(props) {
  const classes = useStyles();
  const bgColor = newGradient(props.name);

  const history = useHistory();

  const handleClick = () => {
    history.push({
      pathname: "/searchResults",
      search: `?query=${props.name}`,
      state: { query: props.name },
    });
  };

  return (
    <Card elevation={8} className={classes.cardCategory} style={{ background: bgColor }} onClick={handleClick}>
      <CardMedia className={classes.mediaCategory} image={`/res/images/${props.name}.png`} title={props.name} />
      <CardContent className={classes.contentCategory}>
        <Typography variant='button' component='h1' className={classes.textCategory}>
          {props.name}
        </Typography>
      </CardContent>
    </Card>
  );
}

function GridCategory() {
  const classes = useStyles();

  return (
    <Grid container className={classes.rootGridScrollView}>
      <Grid item xs>
        <Grid container className={classes.scrollViewCategory}>
          {["breakfast", "fish", "meat", "vegan", "dessert"].map((value) => (
            <Grid key={value} item>
              <CardCategory name={value} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

function CardSuggestion(props) {
  const { recipe } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push({
      pathname: "/recipe",
      search: `?id=${recipe.id}`,
      state: { id: recipe.id },
    });
  };

  return (
    <Card elevation={8} className={classes.cardSuggestion} onClick={handleClick}>
      <CardMedia className={classes.mediaSuggestion} image={recipe.overviewImg} title={recipe.title} />
      <CardContent className={classes.contentSuggestion}>
        <Typography gutterBottom variant='h6' component='h1' className={classes.textSuggestion}>
          {recipe.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function GridSuggestion(props) {
  const { recipes } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.rootGridScrollView}>
      <Grow in={true}>
        <Grid item xs>
          <Grid container className={classes.scrollViewSuggestion}>
            {recipes?.map((recipe) => (
              <Grid key={recipe.id} item>
                <CardSuggestion recipe={recipe} img={props.img} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grow>
    </Grid>
  );
}

function HeaderSuggestion(props) {
  const classes = useStyles();

  return (
    <div className={classes.headerSuggestion}>
      <img src={`res/images/${props.icon}`} width='26' height='26' alt='fire' />
      <Typography variant='h5'>
        <Box fontWeight='400' paddingLeft='8px'>
          {props.title}
        </Box>
      </Typography>
    </div>
  );
}

export default Home;
