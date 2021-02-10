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
  Chip,
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

const DEFAULT_FILTERS = {
  time: [0, 200],
  difficulty: { easy: false, normal: false, hard: false },
  cost: { low: false, medium: false, high: false },
};

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
    objectFit: "cover",
    objectPosition: "center",
  },

  dialogDivider: {
    marginTop: "16px",
    marginBottom: "16px",
  },
}));

function SearchResults(props) {
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchResults, setSearchResults] = useState(null); // all the recipes
  const [filteredRecipes, setFilteredRecipes] = useState(null); // filtered recipes
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [chipData, setChipData] = useState([]);
  const [keyword, setKeyword] = useState("");

  const history = useHistory();

  const mountedRef = useRef();
  const pendingReq = useRef();

  useEffect(() => {
    // on mount
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    let kw; // keyword

    if (mountedRef.current) {
      /* when component is mounted get the keyword from history */
      mountedRef.current = false;
      kw = history.location.search?.replace("?query=", "").replaceAll("%20", " ");
    } else {
      /* otherwise get the keyword from props (SearchBar) */
      kw = props.searchKeyword;
    }

    if (kw === "") setAllRecipes();
    else {
      setRecipesByKeyword(kw);
      setKeyword(kw);
    }
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

  useEffect(() => {
    /* user exit dialog saving a new filters config */

    /* filter the recipes array */
    setFilteredRecipes(
      searchResults?.filter((recipe) => {
        return checkDuration(recipe, filters) && checkDifficulty(recipe, filters) && checkCost(recipe, filters);
      })
    );

    /* update chipData */
    let chipDataArray = [];
    if (filters.time[0] !== 0 || filters.time[1] !== 200)
      chipDataArray.push({
        key: 0,
        label: `${filters.time[0]} - ${filters.time[1] === 200 ? "200+" : filters.time[1]} min`,
      });
    if (filters.cost.low) chipDataArray.push({ key: 1, label: "Low" });
    if (filters.cost.medium) chipDataArray.push({ key: 2, label: "Medium" });
    if (filters.cost.high) chipDataArray.push({ key: 3, label: "High" });
    if (filters.difficulty.easy) chipDataArray.push({ key: 4, label: "Easy" });
    if (filters.difficulty.normal) chipDataArray.push({ key: 5, label: "Normal" });
    if (filters.difficulty.hard) chipDataArray.push({ key: 6, label: "Hard" });
    setChipData(chipDataArray);
  }, [filters]);

  const handleChipDelete = (chipToDelete) => () => {
    let newFilters;
    switch (chipToDelete.key) {
      case 0:
        newFilters = { ...filters, time: DEFAULT_FILTERS.time };
        break;
      case 1:
        newFilters = { ...filters, cost: { ...filters.cost, low: DEFAULT_FILTERS.cost.low } };
        break;
      case 2:
        newFilters = { ...filters, cost: { ...filters.cost, medium: DEFAULT_FILTERS.cost.medium } };
        break;
      case 3:
        newFilters = { ...filters, cost: { ...filters.cost, high: DEFAULT_FILTERS.cost.high } };
        break;
      case 4:
        newFilters = { ...filters, difficulty: { ...filters.difficulty, easy: DEFAULT_FILTERS.cost.easy } };
        break;
      case 5:
        newFilters = { ...filters, difficulty: { ...filters.difficulty, normal: DEFAULT_FILTERS.cost.normal } };
        break;
      case 6:
        newFilters = { ...filters, difficulty: { ...filters.difficulty, hard: DEFAULT_FILTERS.cost.hard } };
        break;
      default:
        break;
    }
    setFilters(newFilters);
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  if (
    filteredRecipes === null ||
    filteredRecipes === undefined ||
    searchResults === null ||
    searchResults === undefined
  ) {
    return <LoadingComponent />;
  } else if (searchResults.length > 0) {
    return (
      <>
        <Box display='flex' flexDirection='column' style={{ marginBottom: "8px", height: "calc(100% - 128px)" }}>
          <Button style={{ padding: "16px", margin: "0px auto" }} startIcon={<TuneIcon />} onClick={handleFilterClick}>
            Filter
          </Button>
          <Box
            display='flex'
            flexDirection='row'
            style={{ marginBottom: "8px", justifyContent: "center", flexWrap: "wrap" }}
          >
            {chipData.map((data) => {
              let icon;
              switch (data.key) {
                case 0:
                  icon = <TimerIcon />;
                  break;
                case 1:
                case 2:
                case 3:
                  icon = <EuroIcon />;
                  break;
                default:
                  icon = null;
                  break;
              }
              return (
                <li key={data.key} style={{ listStyle: "none" }}>
                  <Chip
                    variant='outlined'
                    size='small'
                    label={data.label}
                    onDelete={handleChipDelete(data)}
                    style={{ padding: "4px", margin: "4px" }}
                    icon={icon}
                  />
                </li>
              );
            })}
          </Box>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Recipe key={recipe.id} recipe={recipe} searchKeyword={props.searchKeyword} />
            ))
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                marginLeft: "16px",
              }}
            >
              <Typography variant='h5'>No results match.</Typography>
              <Typography style={{ color: "#757575", marginTop: "16px", textAlign: "center" }}>
                The active filters are hiding all the "{keyword}" recipes.
              </Typography>
              <Button style={{ padding: "16px", margin: "0px auto" }} color='secondary' onClick={handleResetFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </Box>
        <FilterDialog
          open={filterOpen}
          setOpen={setFilterOpen}
          recipes={searchResults}
          savedFilters={filters}
          saveFilters={setFilters}
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
          Try adjusting your search to find what you're searching for.
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
      <Card className={styles.card} onClick={onCardClick} style={{ minHeight: "125px" }}>
        <CardMedia className={styles.media} image={recipe.overviewImg} />
        <Grid
          container
          direction='column'
          justify='space-between'
          alignItems='stretch'
          style={{
            minHeight: "100%",
            overflow: "hidden",
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
              <Typography style={{ fontSize: "0.9em" }}> {recipe.duration}' </Typography>
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
  const { open, setOpen, savedFilters, saveFilters, recipes } = props;
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [currentFilters, setCurrentFilters] = useState(DEFAULT_FILTERS);

  const handleClose = () => {
    setOpen(false);
    setCurrentFilters(savedFilters); // restore saved filters
  };

  const handleReset = () => {
    setCurrentFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    saveFilters(currentFilters); // save current filters
    setOpen(false);
  };

  const handleTimeChange = (event, newTime) => {
    setCurrentFilters({ ...currentFilters, time: newTime });
  };

  const handleDifficultyChange = (event) => {
    setCurrentFilters({
      ...currentFilters,
      difficulty: { ...currentFilters.difficulty, [event.target.name]: event.target.checked },
    });
  };

  const handleCostChange = (event) => {
    setCurrentFilters({
      ...currentFilters,
      cost: { ...currentFilters.cost, [event.target.name]: event.target.checked },
    });
  };

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    setCurrentFilters(savedFilters);
  }, [savedFilters]);

  useEffect(() => {
    setFilteredRecipes(
      recipes.filter((recipe) => {
        return (
          checkDuration(recipe, currentFilters) &&
          checkDifficulty(recipe, currentFilters) &&
          checkCost(recipe, currentFilters)
        );
      })
    );
  }, [currentFilters]);

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
            {`${currentFilters.time[0]} - ${currentFilters.time[1]}${
              (currentFilters.time[1] === 200 && "+") || ""
            } min.`}
          </Typography>
          <div style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            <CustomSlider
              value={currentFilters.time}
              onChange={handleTimeChange}
              color='secondary'
              min={0}
              step={5}
              max={200}
            />
          </div>
          <Divider className={classes.dialogDivider} />

          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Difficulty
          </Typography>
          <FormControl component='fieldset'>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={currentFilters.difficulty.easy} onChange={handleDifficultyChange} name='easy' />
                }
                label='Easy'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentFilters.difficulty.normal}
                    onChange={handleDifficultyChange}
                    name='normal'
                  />
                }
                label='Normal'
              />
              <FormControlLabel
                control={
                  <Checkbox checked={currentFilters.difficulty.hard} onChange={handleDifficultyChange} name='hard' />
                }
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
                    control={<Checkbox checked={currentFilters.cost.low} onChange={handleCostChange} name='low' />}
                    label='Low'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={currentFilters.cost.medium} onChange={handleCostChange} name='medium' />
                    }
                    label='Medium'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={currentFilters.cost.high} onChange={handleCostChange} name='high' />}
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

const checkDuration = (recipe, filters) => {
  const MAX_TIME = 200;
  if (filters.time[1] === MAX_TIME) {
    /* if the user select MAX_TIME as time[1] = max filter time check only the lower bound */
    return recipe.duration >= filters.time[0];
  } else {
    return recipe.duration >= filters.time[0] && recipe.duration <= filters.time[1];
  }
};
const checkDifficulty = (recipe, filters) => {
  if (!filters.difficulty.easy && !filters.difficulty.normal && !filters.difficulty.hard) return true;

  switch (recipe.difficulty.toLowerCase()) {
    case "easy":
      return filters.difficulty.easy;
    case "normal":
      return filters.difficulty.normal;
    case "hard":
      return filters.difficulty.hard;
    default:
      return false;
  }
};
const checkCost = (recipe, filters) => {
  if (!filters.cost.low && !filters.cost.medium && !filters.cost.high) return true;

  switch (recipe.cost) {
    case 1:
      return filters.cost.low;
    case 2:
      return filters.cost.medium;
    case 3:
      return filters.cost.high;
    default:
      return false;
  }
};

export default SearchResults;
