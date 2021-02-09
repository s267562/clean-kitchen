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
  ClickAwayListener,
  Tooltip,
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

const options = ["Settings", "Tutorial", "Privacy"];

const useStyles = makeStyles({
  paper: { borderRadius: 20 },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      searchKeyword: "",
      welcomeTutorialOpen: 1 /* 1 = open on start; 2 = open from options; 0 = close */,
      errorTooltip: false,
    };

    this.setSearchKeyword = this.setSearchKeyword.bind(this);
    this.setWelcomeTutorialOpen = this.setWelcomeTutorialOpen.bind(this);
    this.setErrorTooltip = this.setErrorTooltip.bind(this);
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

  setWelcomeTutorialOpen(value) {
    this.setState({ welcomeTutorialOpen: value });
  }

  setErrorTooltip(value) {
    this.setState({ errorTooltip: value });
  }

  render() {
    return (
      <Router>
        <MyAppBar
          setSearchKeyword={this.setSearchKeyword}
          setWelcomeTutorialOpen={this.setWelcomeTutorialOpen}
          errorTooltip={this.state.errorTooltip}
          setErrorTooltip={this.setErrorTooltip}
        />
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
            <CookingMode setErrorTooltip={this.setErrorTooltip} />
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
  const [isOpenPrivacy, setOpenPrivacy] = useState(false);
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
      props.setWelcomeTutorialOpen(2);
    } else if (index == 2) {
      /* Show Privacy Policy */
      setOpenPrivacy(true);
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

  const handleTooltipClose = () => {
    props.setErrorTooltip(false);
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
              <PrivacyDialog isOpenPrivacy={isOpenPrivacy} setOpenPrivacy={setOpenPrivacy} />
            </>
          ) : (
            <>
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={handleTooltipClose}
                    open={props.errorTooltip}
                    arrow
                    placement='left-end'
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title='Check the commands here!'
                  >
                    <IconButton edge='end' color='inherit' onClick={handleTutorialReminder} disableFocusRipple={true}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </ClickAwayListener>
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
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MicIcon fontSize='large' style={{ padding: "16px" }} />
        <Typography variant='subtitle2' align='center' gutterBottom>
          Here's a quick reminder for you!
        </Typography>
        <Typography variant='caption' align='center'>
          Keep your screen clean while navigating through the recipe hands-free.
        </Typography>
        <img src='./res/images/prox.png' height='64' style={{ padding: "16px" }} />
        <Typography variant='caption' align='center' paragraph>
          Swipe your hand over the proximity sensor, then say the command.
        </Typography>
        <Typography variant='overline' align='center' paragraph>
          Available commands:
        </Typography>
        <div
          style={{
            display: "flex",
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "46px",
            paddingRight: "46px",
            marginBottom: "16px",
            background: "#eeeeee",
            borderRadius: "25px",
          }}
        >
          <Typography variant='overline' align='center'>
            'next'
            <br /> 'back'
            <br /> 'help'
          </Typography>
        </div>
        <Typography variant='caption' align='center'>
          The 'HELP' command will videocall one of our chefs, who will answer all of your questions!
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", padding: "16px" }}>
        <Button edge='start' color='secondary' onClick={handleClose} aria-label='close'>
          Close
        </Button>
      </DialogActions>
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

function PrivacyDialog(props) {
  const { isOpenPrivacy, setOpenPrivacy } = props;
  const [state, setState] = useState(true);

  const handleClose = () => {
    setOpenPrivacy(false);
  };

  const handleChange = (event) => {
    setState(event.target.checked);
  };

  return (
    <Dialog fullScreen open={isOpenPrivacy} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant='overline' style={{ fontSize: "1.1rem" }}>
            Privacy Policy
          </Typography>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography variant='h6' gutterBottom style={{ fontWeight: "bold" }}>
          Where does the audio data go?
        </Typography>
        <Typography variant='body1' paragraph style={{ fontSize: "1.1rem" }}>
          Currently Mozilla is sending audio to Google’s Cloud Speech-to-Text. Google leads the industry in this space
          and has speech recognition in 120 languages.
        </Typography>
        <Typography variant='h6' gutterBottom style={{ fontWeight: "bold" }}>
          What kind of data is collected from the audio sample?
        </Typography>
        <Typography variant='body1' paragraph style={{ fontSize: "1.1rem" }}>
          Prior to sending the data to Google, however, Mozilla routes it through our own server's proxy first, in part
          to strip it of user identity information. This is intended to make it impractical for Google to associate such
          requests with a user account based just on the data Mozilla provides in transcription requests.
        </Typography>
        <Typography variant='h6' gutterBottom style={{ fontWeight: "bold" }}>
          How long my data is stored for?
        </Typography>
        <Typography variant='body1' paragraph style={{ fontSize: "1.1rem" }}>
          Mozilla opts-out of allowing Google to store your voice requests. This means, unlike when a user inputs speech
          using Chrome, their recordings are not saved and can not be attached to their profile and saved indefinitely.
        </Typography>
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
    body:
      "With our app you will find delicious recipes to cook, but here's the twist: \n" +
      "you will be able to use voice commands to navigate through each step of the recipe, " +
      "so that you won't have to worry about having dirty hands while using your phone!",
    imgPath: "logo192.png",
  },
  {
    title: "",
    body: "",
    imgPath: "./res/images/tuthome.jpeg",
  },
  {
    title: "",
    body: "",
    imgPath: "./res/images/tutrecipe.jpeg",
  },
  {
    title: "",
    body: "",
    imgPath: "./res/images/tutcooking.jpeg",
  },
  {
    title: "ASK FOR HELP!",
    body: "Say HELP if you need any suggestions",
    imgPath: "./res/images/tuthelp.jpeg",
  },
  {
    title: "",
    body: "",
    imgPath: "./res/images/tutsettings.jpeg",
  },
];

const TutorialStepper = withStyles((theme) => ({
  dotActive: {
    background: "#c62828",
  },
}))(MobileStepper);

function WelcomeTutorial(props) {
  const { isOpen, setOpen } = props;
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = tutorialSteps.length;

  const handleClose = () => {
    setActiveStep(0); // reset active step
    setOpen(0);
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
          {activeStep === maxSteps - 1 || isOpen === 2 ? (
            /* last active step or tutorial opened from options */
            <IconButton color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          ) : (
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
              {activeStep === 0 ? (
                <>
                  <img src={step.imgPath} width='84px' style={{ margin: "16px auto" }} />
                  <Typography variant='h5' style={{ textAlign: "center", paddingBottom: "32px" }}>
                    {step.title}
                  </Typography>
                  <Typography variant='body1' style={{ textAlign: "center", padding: "16px", whiteSpace: "pre-line" }}>
                    {step.body}
                  </Typography>
                </>
              ) : (
                <img
                  src={step.imgPath}
                  style={{
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              )}
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
                <Button size='medium' onClick={handleClose} color='secondary' style={{ width: "78px" }}>
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
