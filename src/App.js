import { Component, useState, useEffect, forwardRef } from "react";
import CookingMode from "./js/CookingMode";
import { BrowserRouter as Router, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
  DialogTitle,
  DialogContent,
  Slide,
  Switch as SwitchMaterial,
  MobileStepper,
  Grid,
  DialogActions,
} from "@material-ui/core";
import Home from "./js/Home";
import Tutorial from "./js/Tutorial";
import SearchResults from "./js/SearchResults";
import Recipe from "./js/Recipe";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import Zoom from "@material-ui/core/Zoom";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Divider from "@material-ui/core/Divider";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CloseIcon from "@material-ui/icons/Close";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import MicIcon from "@material-ui/icons/Mic";
import fireAPI from "./js/fireAPI";
import SwipeableViews from "react-swipeable-views";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

const options = ["Settings", "Tutorial"];

const useStyles = makeStyles({
  paper: { borderRadius: 20 },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      searchKeyword: "",
      welcomeTutorialOpen: true,
    };

    this.setSearchKeyword = this.setSearchKeyword.bind(this);
    this.setWelcomeTutorialOpen = this.setWelcomeTutorialOpen.bind(this);
  }

  componentDidMount() {
    /*document.addEventListener("scroll", (e) => {
      console.log("on scroll");
      console.log(e);
      document.activeElement.blur();
    });*/

    document.addEventListener("touchstart", (e) => {
      if (e.target.id !== "search-bar") document.activeElement.blur();
    });
  }

  setSearchKeyword(keyword) {
    this.setState({
      searchKeyword: keyword,
    });
  }

  setWelcomeTutorialOpen(isOpen) {
    this.setState({ welcomeTutorialOpen: isOpen });
  }

  render() {
    return (
      <Router>
        <MyAppBar setSearchKeyword={this.setSearchKeyword} setWelcomeTutorialOpen={this.setWelcomeTutorialOpen} />
        <Switch>
          <Route path='/tutorial'>
            <Tutorial />
          </Route>
          <Route path='/searchResults'>
            {" "}
            {/* field keyword (/:keyword) */}
            <SearchResults searchKeyword={this.state.searchKeyword} />
          </Route>
          <Route path='/recipe'>
            {" "}
            {/* field id (/:id) */}
            <Recipe />
          </Route>
          <Route path='/cookingMode'>
            <CookingMode />
          </Route>
          <Route path='/'>
            <Home />
            <WelcomeTutorial isOpen={this.state.welcomeTutorialOpen} setOpen={this.setWelcomeTutorialOpen} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function ElevationScroll(props) {
  const { children } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function MyAppBar(props) {
  const history = useHistory();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loc, setLoc] = useState(null);
  const [isOpenReminder, setOpenReminder] = useState(true);
  const [isOpenSettings, setOpenSettings] = useState(false);
  const [autofocus, setAutofocus] = useState(false);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    setLoc(location);
    if (history.location.pathname.toLowerCase() === "/cookingmode") {
      const queryParams = location.search.replace("?", "").split("&");
      const id = queryParams[0].replace("id=", "");
      fireAPI.getRecipeBy_id(id).then((recipe) => {
        setRecipe(recipe);
      });
    }
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSearchClick = (event) => {
    history.push({
      pathname: "/searchResults",
    });
    setAutofocus(true);
  };

  const handleClose = (event, index) => {
    setAnchorEl(null);
  };

  const handleOptionClick = (event, index) => {
    if (index === 0) {
      /* settings */
      setOpenSettings(true);
    } else if (index === 1) {
      /* show tutorial */
      props.setWelcomeTutorialOpen(true);
    }

    setAnchorEl(null);
  };

  const handleBack = () => {
    if (loc !== null && loc.pathname.toLowerCase() === "/searchresults") history.push({ pathname: "/" });
    else if (loc !== null && loc.pathname.toLowerCase() === "/recipe") history.goBack();
  };

  const handleExit = () => {
    history.goBack();
  };

  const handleTutorialReminder = () => {
    setOpenReminder(true);
  };

  return (
    <ElevationScroll {...props}>
      <AppBar position='sticky' style={{ background: "#fafafa", color: "#000" }}>
        <Toolbar>
          {loc !== null &&
            (loc.pathname.toLowerCase() === "/searchresults" || loc.pathname.toLowerCase() === "/recipe") && (
              <IconButton edge='start' color='inherit' onClick={handleBack} disableFocusRipple={true}>
                <ArrowBackIcon />
              </IconButton>
            )}
          {loc !== null && loc.pathname.toLowerCase() === "/cookingmode" && (
            <IconButton edge='start' color='inherit' onClick={handleExit} disableFocusRipple={true}>
              <CloseIcon />
            </IconButton>
          )}
          <Typography
            variant='h6'
            style={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {loc !== null && loc.pathname.toLowerCase() === "/cookingmode" ? recipe?.title : "Clean Kitchen"}
          </Typography>
          {loc !== null && loc.pathname.toLowerCase() !== "/cookingmode" ? (
            <>
              {loc.pathname === "/" && (
                <IconButton edge='end' color='inherit' onClick={handleSearchClick} disableFocusRipple={true}>
                  <Search />
                </IconButton>
              )}
              <IconButton edge='end' color='inherit' onClick={handleClick} disableFocusRipple={true}>
                <MoreVertIcon />
              </IconButton>
              <SettingsDialog isOpenSettings={isOpenSettings} setOpenSettings={setOpenSettings} />
            </>
          ) : (
            <>
              <IconButton edge='end' color='inherit' onClick={handleTutorialReminder} disableFocusRipple={true}>
                <HelpOutlineIcon />
              </IconButton>
              <TutorialReminderDialog isOpenReminder={isOpenReminder} setOpenReminder={setOpenReminder} />
            </>
          )}
          <Menu id='setting-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            {options.map((option, index) => (
              <MenuItem key={option} onClick={(event) => handleOptionClick(event, index)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
        {loc !== null && loc.pathname.toLowerCase() === "/searchresults" && (
          <SearchBar autofocus={autofocus} setSearchKeyword={props.setSearchKeyword} />
        )}
      </AppBar>
    </ElevationScroll>
  );
}

const CustomSearchField = withStyles({
  root: {
    background: "#eeeeee",
    borderRadius: 25,
    "& .Mui-focused": {
      background: "#fafafa",
    },
    "& label.Mui-focused": {
      color: "transparent",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderWidth: "0px",
        borderRadius: 25,
      },
      "&.Mui-focused fieldset": {
        borderWidth: "0px",
        boxShadow: "0px 0px 6px 0px #8E8E8E",
      },
    },
  },
})(TextField);

function SearchBar(props) {
  const history = useHistory();
  const [isSelected, setIsSelected] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(history.location.search?.replace("?query=", "").replaceAll("%20", " "));
  }, [history]);

  const handleMouseDownSearch = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    props.setSearchKeyword(event.target.value);
  };

  const handleClear = () => {
    setValue("");
    props.setSearchKeyword("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value !== "") {
      /* the user typed something */
      history.push({
        pathname: "/searchResults",
        search: `?query=${value}`,
        state: { query: value },
      });
    }
    document.activeElement.blur(); /* unfocus search view */
  };

  // const iconAdornment = (isSelected && value !== '')
  const iconAdornment =
    value !== ""
      ? {
          endAdornment: (
            <InputAdornment position='end'>
              <Zoom in={/* isSelected */ value !== ""}>
                <IconButton
                  aria-label='clear search'
                  onMouseDown={handleMouseDownSearch}
                  onClick={handleClear}
                  edge='start'
                >
                  <Clear />
                </IconButton>
              </Zoom>
              <Zoom in={/* isSelected */ value !== ""}>
                <Divider orientation='vertical' style={{ height: "16px" }} />
              </Zoom>
              <IconButton
                aria-label='search'
                type='submit'
                onMouseDown={handleMouseDownSearch}
                onClick={handleSubmit}
                edge='end'
              >
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }
      : {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton aria-label='search' edge='end' size='small'>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "16px" }}>
      <Slide direction='down' in timeout={150}>
        <CustomSearchField
          label={isSelected || value !== "" ? "" : "Search for recipes"}
          variant='outlined'
          id='search-bar'
          size='small'
          autoFocus={history.location.search === ""}
          style={{ width: "100%" }}
          value={value}
          /* styles the input component */
          InputProps={iconAdornment}
          InputLabelProps={{
            style: { color: "#000" },
          }}
          onFocus={(e) => {
            setIsSelected(true);
          }}
          onBlur={(e) => setIsSelected(false)}
          onChange={handleChange}
        />
      </Slide>
    </form>
  );
}

function TutorialReminderDialog(props) {
  const { isOpenReminder, setOpenReminder } = props;
  const classes = useStyles();

  const handleClose = () => {
    setOpenReminder(false);
  };

  return (
    <Dialog open={isOpenReminder} onBackdropClick={handleClose} classes={{ paper: classes.paper }}>
      <DialogTitle disableTypography style={{ margin: "0", paddingBottom: "0" }}>
        <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "0",
          paddingBottom: "64px",
        }}
      >
        <MicIcon fontSize='large' style={{ padding: "16px" }} />
        <Typography variant='subtitle2' align='center' gutterBottom>
          {" "}
          Here's a quick reminder for you!
        </Typography>
        <Typography variant='caption' align='center' paragraph>
          {" "}
          Keep your screen clean while navigating through the recipe hands-free.{" "}
        </Typography>
        <Typography variant='overline' align='center' paragraph>
          {" "}
          Available commands:
        </Typography>
        <div
          style={{
            display: "flex",
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "46px",
            paddingRight: "46px",
            background: "#eeeeee",
            borderRadius: "25px",
          }}
        >
          <Typography variant='overline' align='center'>
            {" "}
            'next'
            <br /> 'back'
            <br /> 'help'
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingsDialog(props) {
  const { isOpenSettings, setOpenSettings } = props;
  const [state, setState] = useState(true);

  const handleClose = () => {
    setOpenSettings(false);
  };

  const handleSave = () => {
    handleClose();
  };

  const handleChange = (event) => {
    setState(event.target.checked);
  };

  return (
    <Dialog fullScreen open={isOpenSettings} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Button onClick={handleSave} color='secondary'>
            Save
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column'>
          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Theme
          </Typography>
          <Typography variant='overline' style={{ color: "#757575" }}>
            light
          </Typography>
          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />

          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Language
          </Typography>
          <Typography variant='overline' style={{ color: "#757575" }}>
            english
          </Typography>
          <Divider style={{ marginTop: "16px", marginBottom: "16px" }} />

          <Box display='flex' alignItems='center'>
            <Box display='flex' flexDirection='column'>
              <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
                Reminder
              </Typography>
              <Typography variant='overline' style={{ lineHeight: "1.6em" }}>
                show voice commands reminder when you start cooking
              </Typography>
            </Box>
            <Divider orientation='vertical' style={{ height: "64px", marginRight: "16px", marginLeft: "16px" }} />
            <SwitchMaterial
              checked={state}
              onChange={handleChange}
              style={{ width: "20px", height: "20px" }}
              name='checkedA'
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const tutorialSteps = [
  {
    title: "WELCOME TO CLEAN KITCHEN!",
    body: "",
    imgPath: "logo192.png",
  },
  {
    title: "HOME",
    body: "Select what you want to cook! Search your recipe from our categories",
    imgPath: "",
  },
  {
    title: "RECIPE OVERVIEW",
    body: "Servings + lets cook",
    imgPath: "",
  },
  {
    title: "COOKING MODE",
    body: "tutorial reminder + tutorial button",
    imgPath: "",
  },
  {
    title: "ASK FOR HELP!",
    body: "Say HELP if you need any suggestions",
    imgPath: "",
  },
  {
    title: "FINAL: SETTINGS + TUTORIAL",
    body: "",
    imgPath: "",
  },
];

const TutorialStepper = withStyles((theme) => ({
  dotActive: {
    background: "#c62828",
  },
}))(MobileStepper);

function WelcomeTutorial(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { isOpen, setOpen } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Dialog fullScreen open={isOpen} onBackdropClick={handleClose}>
      <DialogTitle style={{ margin: "0", paddingBottom: "0" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {activeStep !== maxSteps - 1 ? (
            <Button
              edge='end'
              color='secondary'
              size='large'
              onClick={handleClose}
              aria-label='close'
              style={{ padding: "11px" }}
            >
              skip
            </Button>
          ) : (
            <IconButton color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent
        style={{
          paddingRight: "0",
          paddingLeft: "0",
        }}
      >
        <SwipeableViews
          enableMouseEvents
          index={activeStep}
          onChangeIndex={handleStepChange}
          style={{ height: "100%" }}
          containerStyle={{ height: "100%" }}
        >
          {tutorialSteps.map((step, index) => (
            <Grid
              key={index}
              container
              style={{
                flexGrow: 1,
                flexDirection: "column",
                padding: "16px",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography variant='h5' style={{ textAlign: "center" }}>
                {step.title}
              </Typography>
              <img src={step.imgPath} width='84px' style={{ margin: "16px auto" }} />
            </Grid>
          ))}
        </SwipeableViews>
      </DialogContent>
      <DialogActions style={{ padding: "0" }}>
        <TutorialStepper
          steps={maxSteps}
          position='static'
          variant='dots'
          activeStep={activeStep}
          style={{ width: "100%", background: "white", padding: "16px" }}
          color='secondary'
          nextButton={
            <>
              {activeStep !== maxSteps - 1 ? (
                <Button size='medium' onClick={handleNext} style={{ width: "78px" }}>
                  Next
                </Button>
              ) : (
                <Button size='medium' onClick={handleNext} color='secondary' style={{ width: "78px" }}>
                  Start
                </Button>
              )}
            </>
          }
          backButton={
            <Button size='medium' onClick={handleBack} disabled={activeStep === 0} style={{ width: "78px" }}>
              Back
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
}

export default App;
