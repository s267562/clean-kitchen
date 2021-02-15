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
import LoadingComponent from "./LoadingComponent";
import fireAPI from "./fireAPI";
import { ClickAwayListener, Fade } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

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
  paperIngredients: {
    height: "min-content",
    width: "100%",
    borderRadius: 0,
    marginBottom: 4,
  },
  paperDirections: {
    height: "min-content",
    width: "100%",
    borderRadius: 0,
    marginBottom: 82,
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
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    setId(location.search.replace("?id=", ""));
  }, [location]);

  useEffect(() => {
    if (id !== "") {
      fireAPI.getRecipeBy_id(id).then((recipe) => {
        console.log(recipe);
        setRecipe(recipe);
        setYield(recipe.yield);
      });
    }
  }, [id]);

  const handleClick = () => {
    if (recipe.directionsNumber > 0) {
      history.push({
        pathname: "/cookingMode",
        search: `?id=${recipe.id}&y=${currentYield}`,
        state: { id: recipe.id, currentYield: currentYield },
      });
    } else {
      setTooltipOpen(true);
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  if (recipe === null) {
    return <LoadingComponent />;
  } else {
    return (
      <>
        <RecipeOverview key={recipe.id} recipe={recipe} currentYield={currentYield} setYield={setYield} />
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={tooltipOpen}
              arrow
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title='Sorry, this recipe is not available'
            >
              <Fab
                variant='extended'
                color='secondary'
                style={
                  recipe.directionsNumber > 0
                    ? {
                        position: "fixed",
                        bottom: "16px",
                        right: "16px",
                      }
                    : {
                        position: "fixed",
                        bottom: "16px",
                        right: "16px",
                        opacity: "0.65",
                        background: "#e0e0e0",
                        boxShadow: "unset",
                        color: "#717171",
                      }
                }
                onClick={handleClick}
              >
                Let's cook!
              </Fab>
            </Tooltip>
          </div>
        </ClickAwayListener>
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
        <Directions recipe={recipe} />
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
        <Typography
          variant='h5'
          style={{
            paddingTop: "8px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {recipe.title}{" "}
        </Typography>
        <Grid container className={classes.infoTitle}>
          <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
            <TimerIcon style={{ paddingRight: "8px" }} />
            <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
              Time: {recipe.duration} min
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
            <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
              Difficulty: {recipe.difficulty}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
            {recipe.directionsNumber > 0 ? (
              <>
                <img src={`res/images/chef.png`} width='24px' alt='chef' style={{ paddingRight: "8px" }} />
                <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
                  Guided recipe
                </Typography>
              </>
            ) : (
              <>
                <img src={`res/images/not-chef.png`} width='24px' alt='chef' style={{ paddingRight: "8px" }} />
                <Typography variant='overline' style={{ display: "flex", alignContent: "center" }}>
                  Not guided recipe
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={6} style={{ display: "flex", alignItems: "center" }}>
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
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

function Ingredients(props) {
  const { recipe, currentYield, setYield } = props;
  const classes = useStyles();
  // enable vibration support
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  return (
    <Box className={classes.itemTitle}>
      <Paper elevation={0} className={classes.paperIngredients}>
        <Box className={classes.headerIngredients}>
          <Typography variant='h6' style={{ paddingLeft: "16px", fontWeight: "bold" }}>
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
                    if (navigator.vibrate) {
                      // vibration API supported
                      navigator.vibrate(150);
                    }
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
                    if (navigator.vibrate) {
                      // vibration API supported
                      navigator.vibrate(150);
                    }
                  }
                }}
              >
                <ArrowDownIcon />
              </IconButton>
            </ButtonGroup>

            <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: "8px" }}>
              <Fade key={currentYield} in timeout={600}>
                <Typography variant='h6' style={{ lineHeight: "1.3" }}>
                  {currentYield}
                </Typography>
              </Fade>
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
                  <Fade key={currentYield} in timeout={600}>
                    <span>{value.quantity && Math.round(((value.quantity * currentYield) / 4) * 2) / 2} </span>
                  </Fade>
                  {value.unit} <b> {value.name} </b>{" "}
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
        <Typography
          variant='h6'
          style={{ paddingTop: "8px", paddingLeft: "16px", paddingRight: "16px", fontWeight: "bold" }}
        >
          Description
        </Typography>
        <Typography
          variant='body2'
          style={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px" }}
        >
          {recipe.description}
        </Typography>
      </Paper>
    </Box>
  );
}

function Directions(props) {
  const { recipe } = props;
  const classes = useStyles();
  return (
    <Box className={classes.itemTitle}>
      <Paper elevation={0} className={classes.paperDirections}>
        <Typography
          variant='h6'
          style={{ paddingTop: "8px", paddingLeft: "16px", paddingRight: "16px", fontWeight: "bold" }}
        >
          Directions
        </Typography>
        <List dense style={{ paddingTop: "0" }}>
          {recipe.directions.map((value) => {
            return (
              <ListItem key={value.description}>
                <ListItemText primary={value.description} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default Recipe;
