import { Component, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { Rating } from "@material-ui/lab";
import EuroIcon from "@material-ui/icons/Euro";
import TimerIcon from "@material-ui/icons/Timer";
import IconButton from "@material-ui/core/IconButton";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import ListItemText from "@material-ui/core/ListItemText";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import API from "./API";
import LoadingComponent from "./LoadingComponent";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "safe center",
    height: "100%",
  },
  itemMedia: {
    width: "100%",
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  media: {
    maxHeight: "200px",
    width: "100%",
    borderRadius: 0,
    objectFit: "cover",
    objectPosition: "center",
  },
  itemTitle: {
    width: "100%",
  },
  paperTitle: {
    height: "min-content",
    width: "100%",
    borderRadius: 0,
    marginBottom: 4,
  },
  infoTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerIngredients: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "min-content",
    width: "100%",
    paddingTop: 8,
    paddingBottom: 0,
    borderRadius: 0,
  },
  listIngredients: {
    paddingLeft: 0,
    paddingRight: 16,
  },
});

const StyledRating = withStyles({
  iconFilled: {
    color: "#c62828",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

function Recipe() {
  const history = useHistory();
  const location = useLocation();
  const [currentYield, setYield] = useState(4);

  const [id, setId] = useState("");
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    setId(location.search.replace("?id=", ""));
  }, [location]);

  useEffect(() => {
    if (id !== "") {
      API.getRecipe(id).then((recipe) => {
        setRecipe(recipe);
        setYield(recipe.yield);
      });
    }
  }, [id]);

  const handleClick = () => {
    history.push({
      pathname: "/cookingMode",
      search: `?id=${recipe.id}&y=${currentYield}`,
      state: { id: recipe.id, currentYield: currentYield },
    });
  };

  if (recipe === null) {
    return <LoadingComponent />;
  } else {
    return (
      <>
        <RecipeOverview key={recipe.id} recipe={recipe} currentYield={currentYield} setYield={setYield} />
        <Fab
          variant='extended'
          color='secondary'
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
          }}
          onClick={handleClick}
        >
          Let's cook!
        </Fab>
      </>
    );
  }
}

function RecipeOverview(props) {
  const { recipe, currentYield, setYield } = props;
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs>
        <Box className={classes.itemMedia}>
          <img src={`${recipe.overviewImg}`} alt='Carbonara' className={classes.media} />
        </Box>
        <RecipeHeader recipe={recipe} />
        <Descriptions recipe={recipe} />
        <Ingredients recipe={recipe} currentYield={currentYield} setYield={setYield} />
      </Grid>
    </Grid>
  );
}

function RecipeHeader(props) {
  const { recipe } = props;
  const classes = useStyles();

  return (
    <Box className={classes.itemTitle}>
      <Paper elevation={0} className={classes.paperTitle}>
        <Typography variant='h5' style={{ paddingTop: "8px", paddingLeft: "16px", paddingRight: "16px" }}>
          {recipe.title}
        </Typography>
        <Box className={classes.infoTitle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TimerIcon style={{ paddingRight: "8px" }} />
            <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
              Time: {recipe.duration} min
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
              {" "}
              Cost
            </Typography>
            <StyledRating
              readOnly
              style={{ paddingLeft: "8px" }}
              name='cost-rating'
              max={3}
              value={recipe.cost}
              icon={<EuroIcon fontSize='small' />}
            />
          </div>
        </Box>
      </Paper>
    </Box>
  );
}

function Ingredients(props) {
  const { recipe, currentYield, setYield } = props;
  const classes = useStyles();

  return (
    <Box className={classes.itemTitle}>
      <Paper elevation={0} className={classes.paperTitle}>
        <Box className={classes.headerIngredients}>
          <Typography variant='h6' style={{ paddingLeft: "16px" }}>
            Ingredients
          </Typography>
          <Box
            aria-label='servings group'
            style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingRight: "16px" }}
          >
            <ButtonGroup
              orientation='vertical'
              color='default'
              aria-label='increase/decrease group'
              variant='text'
              size='small'
            >
              <IconButton
                aria-label='increase'
                onClick={() => {
                  if (currentYield < 100) {
                    setYield(currentYield + 1);
                  }
                }}
              >
                <ArrowUpIcon />
              </IconButton>

              <IconButton
                aria-label='decrease'
                onClick={() => {
                  if (currentYield > 1) {
                    setYield(currentYield - 1);
                  }
                }}
              >
                <ArrowDownIcon />
              </IconButton>
            </ButtonGroup>

            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "8px" }}>
              <Typography variant='h6' style={{ lineHeight: "1.3" }}>
                {currentYield}
              </Typography>
              <Typography variant='overline' style={{ color: "#757575", fontSize: "0.7rem", lineHeight: "1" }}>
                servings
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.listIngredients}>
          <Typography variant='body1' style={{ paddingRight: "16px" }}>
            <IngredientsList recipe={recipe} currentYield={currentYield} />
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

function IngredientsList(props) {
  const { recipe, currentYield } = props;

  return (
    <List dense style={{ paddingTop: "0" }}>
      {recipe.ingredients.map((value) => {
        return (
          <ListItem key={value.name}>
            <ListItemText
              primary={
                <span>
                  {value.quantity && Math.round((value.quantity * currentYield) / 4)} {value.unit} <b> {value.name} </b>{" "}
                </span>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}

function Descriptions(props) {
  const { recipe } = props;
  const classes = useStyles();
  return (
    <Box className={classes.itemTitle}>
      <Paper elevation={0} className={classes.paperTitle}>
        <Typography variant='h6' style={{ paddingTop: "8px", paddingLeft: "16px", paddingRight: "16px" }}>
          Description
        </Typography>
        <Typography
          variant='body1'
          style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px" }}
        >
          {recipe.description}
        </Typography>
      </Paper>
    </Box>
  );
}

export default Recipe;
