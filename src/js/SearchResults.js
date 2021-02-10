import { React, useEffect, useState, forwardRef, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Button,
  Slide,
  Dialog,
  IconButton,
  Slider,
  DialogContent,
  DialogActions,
  FormControl,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Rating } from "@material-ui/lab";
import EuroIcon from "@material-ui/icons/Euro";
import TimerIcon from "@material-ui/icons/Timer";
import TuneIcon from "@material-ui/icons/Tune";
import LoadingComponent from "./LoadingComponent";
import CloseIcon from "@material-ui/icons/Close";
import Grow from "@material-ui/core/Grow";
import fireAPI from "./fireAPI";

const StyledRating = withStyles({
  iconFilled: {
    color: "#c62828",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: "0px",
    boxShadow: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
    marginBottom: "4px",
    marginTop: "4px",
    height: "128px",
  },

  media: {
    height: "100%",
    minWidth: "150px",
    borderRadius: "8px",
    boxShadow: "0px 0px 16px rgba(34, 35, 58, 0.3)",
  },

  dialogDivider: {
    marginTop: "16px",
    marginBottom: "16px",
  },
}));

function SearchResults(props) {
  const [searchResults, setSearchResults] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(null);
  const history = useHistory();

  const mountedRef = useRef();

  const pendingReq = useRef();

  useEffect(() => {
    // on mount
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    let keyword;

    if (mountedRef.current) {
      /* when component is mounted get the keyword from history */
      mountedRef.current = false;
      keyword = history.location.search?.replace("?query=", "").replaceAll("%20", " ");
    } else {
      /* otherwise get the keyword from props (SearchBar) */
      keyword = props.searchKeyword;
    }

    if (keyword === "") setAllRecipes();
    else setRecipesByKeyword(keyword);
  }, [history, props.searchKeyword]);

  const setRecipesByKeyword = (keyword) => {
    const req = fireAPI.getRecipesBy_keyword(keyword);

    if (pendingReq.current !== undefined) {
      /* if there is pending request (i.e. the user insert two chars very quickly), the new request is performed later */
      pendingReq.current.then(() => {
        req.then((recipes) => {
          setSearchResults(recipes);
          setFilteredRecipes(recipes);
          pendingReq.current = undefined;
        });
      });
    } else {
      pendingReq.current = req;
      req.then((recipes) => {
        setSearchResults(recipes);
        setFilteredRecipes(recipes);
        pendingReq.current = undefined;
      });
    }
  };

  const setAllRecipes = () => {
    fireAPI.getAllRecipes().then((recipes) => {
      setSearchResults(recipes);
      setFilteredRecipes(recipes);
    });
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  if (filteredRecipes === null) {
    return <LoadingComponent />;
  } else if (filteredRecipes.length > 0) {
    return (
      <>
        <Box display='flex' flexDirection='column' style={{ marginBottom: "8px" }}>
          <Button style={{ padding: "16px", margin: "auto" }} startIcon={<TuneIcon />} onClick={handleFilterClick}>
            Filter
          </Button>
          {filteredRecipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} searchKeyword={props.searchKeyword} />
          ))}
        </Box>
        <FilterDialog
          open={filterOpen}
          setOpen={setFilterOpen}
          recipes={searchResults}
          setResult={setFilteredRecipes}
        />
      </>
    );
  } else {
    return (
      <div
        style={{
          height: "calc(100% - 128px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "16px",
          marginLeft: "16px",
        }}
      >
        <img src='/res/images/noresults.png' alt='no results' />
        <Typography variant='h4'>No results found</Typography>
        <Typography style={{ color: "#757575", marginTop: "16px", textAlign: "center" }}>
          Try adjusting your search or filter to find what you're searching for.
        </Typography>
      </div>
    );
  }
}

function Recipe(props) {
  const { recipe } = props;
  const styles = useStyles();
  const history = useHistory();

  const onCardClick = () => {
    if (props.searchKeyword !== "") {
      //fix back navigation issue when clicking on a card without submitting a query
      history.push({
        pathname: "/searchResults",
        search: `?query=${props.searchKeyword}`,
        state: { query: props.searchKeyword },
      });
    }
    history.push({
      pathname: "/recipe",
      search: `?id=${recipe.id}`,
      state: { id: recipe.id },
    });
  };

  return (
    <Grow in={true}>
      <Card className={styles.card} onClick={onCardClick}>
        <CardMedia className={styles.media} image={recipe.overviewImg} />
        <Grid
          container
          direction='column'
          justify='space-between'
          alignItems='stretch'
          style={{
            overflow: "hidden",
            height: "100%",
            marginLeft: "16px",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          <Grid item>
            <Typography
              style={{
                fontSize: 16,
                fontWeight: "bold",
                lineHeight: "24px",
                maxHeight: "48px",
                overflow: "hidden",
              }}
              color='textPrimary'
            >
              {recipe.title}
            </Typography>
          </Grid>
          <Grid item>
            <Box display='flex' flexDirection='row' style={{ marginTop: "8px", marginBottom: "8px" }}>
              <Typography style={{ fontSize: "0.9em" }} color='textSecondary'>
                {" "}
                Difficulty:&nbsp;{" "}
              </Typography>
              <Typography style={{ fontSize: "0.9em" }} color='textPrimary'>
                {" "}
                {recipe.difficulty}{" "}
              </Typography>
            </Box>
            <Box display='flex' flexDirection='row'>
              <TimerIcon fontSize='small' style={{ marginRight: "8px" }} />
              <Typography style={{ fontSize: "0.9em" }}> {recipe.duration} min </Typography>
              <Divider orientation='vertical' style={{ marginLeft: "8px", marginRight: "8px", height: "21px" }} />
              <StyledRating
                name='cost-rating'
                readOnly
                max={3}
                value={recipe.cost}
                icon={<EuroIcon fontSize='small' />}
              />
              <Divider orientation='vertical' style={{ marginLeft: "8px", marginRight: "8px", height: "21px" }} />
              {recipe.directionsNumber > 0 ? (
                <>
                  <img src={`res/images/chef.png`} width='20px' height='20px' alt='chef' />
                </>
              ) : (
                <>
                  <img src={`res/images/not-chef.png`} width='20px' height='20px' alt='chef' />
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grow>
  );
}

const CustomSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
    },
  },
  track: {
    height: 4,
  },
  rail: {
    height: 4,
  },
})(Slider);

function FilterDialog(props) {
  const classes = useStyles();
  const { open, setOpen, setResult } = props;
  const [filteredRecipes, setFilteredRecipes] = useState(props.recipes);
  const [time, setTime] = useState([0, 200]);
  const [difficulty, setDifficulty] = useState({ easy: false, medium: false, hard: false });
  const [cost, setCost] = useState({ low: false, medium: false, high: false });

  const [savedTime, setSavedTime] = useState([0, 200]);
  const [savedDifficulty, setSavedDifficulty] = useState({ easy: false, medium: false, hard: false });
  const [savedCost, setSavedCost] = useState({ low: false, medium: false, high: false });

  const handleClose = () => {
    setOpen(false);
    resetSavedFilters();
  };

  const resetSavedFilters = () => {
    setTime(savedTime);
    setDifficulty(savedDifficulty);
    setCost(savedCost);
  };

  const handleReset = () => {
    setTime([0, 200]);
    setDifficulty({ easy: false, medium: false, hard: false });
    setCost({ low: false, medium: false, high: false });
  };

  const handleApply = () => {
    setResult(filteredRecipes);
    saveFilters();
    setOpen(false);
  };

  const saveFilters = () => {
    setSavedTime(time);
    setSavedDifficulty(difficulty);
    setSavedCost(cost);
  };

  const handleTimeChange = (event, newTime) => {
    setTime(newTime);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty({ ...difficulty, [event.target.name]: event.target.checked });
  };

  const handleCostChange = (event) => {
    setCost({ ...cost, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    setFilteredRecipes(props.recipes);
  }, props.recipes);

  useEffect(() => {
    setFilteredRecipes(
      props.recipes.filter((recipe) => {
        return checkDuration(recipe) && checkDifficulty(recipe) && checkCost(recipe);
      })
    );
  }, [time, difficulty, cost]);

  function checkDuration(recipe) {
    const MAX_TIME = 200;
    if (time[1] === MAX_TIME) {
      /* if the user select MAX_TIME as time[1] = max filter time check only the lower bound */
      return recipe.duration > time[0];
    } else {
      return recipe.duration > time[0] && recipe.duration < time[1];
    }
  }
  function checkDifficulty(recipe) {
    if (!difficulty.easy && !difficulty.medium && !difficulty.hard) return true;

    switch (recipe.difficulty.toLowerCase()) {
      case "easy":
        return difficulty.easy;
      case "medium":
        return difficulty.medium;
      case "hard":
        return difficulty.hard;
      default:
        return false;
    }
  }
  function checkCost(recipe) {
    if (!cost.low && !cost.medium && !cost.high) return true;

    switch (recipe.cost) {
      case 1:
        return cost.low;
      case 2:
        return cost.medium;
      case 3:
        return cost.high;
      default:
        return false;
    }
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogActions
        style={{
          justifyContent: "space-between",
          textAlign: "center",
          alignItems: "center",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div style={{ display: "flex", flex: "1 0 0", justifyContent: "flex-start" }}>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ flex: "1 0 0" }}>
          <Typography variant='overline' style={{ fontSize: "1.1rem", margin: "0" }}>
            Filter
          </Typography>
        </div>
        <div style={{ display: "flex", flex: "1 0 0", justifyContent: "flex-end" }}>
          <Button onClick={handleReset} color='secondary'>
            Reset
          </Button>
        </div>
      </DialogActions>
      <DialogContent>
        <Box display='flex' flexDirection='column'>
          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Time range
          </Typography>
          <Typography variant='overline' style={{ color: "#757575" }}>
            {`${time[0]} - ${time[1]}${(time[1] === 200 && "+") || ""} min.`}
          </Typography>
          <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            <CustomSlider value={time} onChange={handleTimeChange} color='secondary' min={0} step={5} max={200} />
          </div>
          <Divider className={classes.dialogDivider} />

          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Difficulty
          </Typography>
          <FormControl component='fieldset'>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={difficulty.easy} onChange={handleDifficultyChange} name='easy' />}
                label='Easy'
              />
              <FormControlLabel
                control={<Checkbox checked={difficulty.medium} onChange={handleDifficultyChange} name='medium' />}
                label='Medium'
              />
              <FormControlLabel
                control={<Checkbox checked={difficulty.hard} onChange={handleDifficultyChange} name='hard' />}
                label='Hard'
              />
            </FormGroup>
          </FormControl>
          <Divider className={classes.dialogDivider} />

          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Cost
          </Typography>
          <FormControl component='fieldset'>
            <FormGroup>
              <Box display='flex'>
                <Box display='flex' flexDirection='column'>
                  <FormControlLabel
                    control={<Checkbox checked={cost.low} onChange={handleCostChange} name='low' />}
                    label='Low'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={cost.medium} onChange={handleCostChange} name='medium' />}
                    label='Medium'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={cost.high} onChange={handleCostChange} name='high' />}
                    label='High'
                  />
                </Box>
                <Box display='flex' flexDirection='column'>
                  <div
                    style={{
                      height: "42px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EuroIcon color='secondary' fontSize='small' />
                  </div>
                  <div
                    style={{
                      height: "42px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EuroIcon color='secondary' fontSize='small' />
                    <EuroIcon color='secondary' fontSize='small' />
                  </div>
                  <div
                    style={{
                      height: "42px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EuroIcon color='secondary' fontSize='small' />
                    <EuroIcon color='secondary' fontSize='small' />
                    <EuroIcon color='secondary' fontSize='small' />
                  </div>
                </Box>
              </Box>
            </FormGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", padding: "24px" }}>
        <Button
          onClick={handleApply}
          variant='contained'
          size='large'
          color='secondary'
          disabled={filteredRecipes.length === 0}
          style={{ borderRadius: "25px", color: "#fff" }}
        >
          {`Show ${filteredRecipes.length} recipes`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default SearchResults;
