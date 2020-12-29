import { Component } from 'react';
import CookingMode from './js/CookingMode';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Home from './js/Home';
import Tutorial from './js/Tutorial';
import SearchView from './js/Search';
import Recipe from './js/Recipe';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

const settingOptions = [
  'Setting #0',
  'Setting #1',
  'Setting #2',
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };

  }

  render() {
    return (
      <Router>
        <MyAppBar />
        <Switch>
          <Route path="/tutorial">
            <Tutorial />
          </Route>
          <Route path="/searchResults"> { /* field keyword (/:keyword)*/}
            <SearchView />
          </Route>
          <Route path="/recipe"> { /* field id (/:id)*/}
            <Recipe />
          </Route>
          <Route path="/cookingMode">
            <CookingMode />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function MyAppBar(props) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, index) => {
    console.log("handleClose - " + settingOptions[index]);
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" style={{ background: "#fafafa", color: "#000", marginBottom: '8px' }}>
      <Toolbar >
        <Typography variant="h6" style={{ flexGrow: 1 }} >
          Clean Kitchen
      </Typography>
        <IconButton edge="end" color="inherit" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="setting-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {settingOptions.map((option, index) => (
            <MenuItem
              key={option}
              onClick={(event) => handleClose(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
      {
        (history.location.pathname === '/' || history.location.pathname === '/searchResults') && <SearchBar />
      }
    </AppBar>
  );
}

const CustomSearchField = withStyles({
  root: {
    background: "#eeeeee",
    borderRadius: 25,
    '& label.Mui-focused': {
      color: '#000',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#000',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: "transparent",
        borderRadius: 25,
      },
      '&.Mui-focused fieldset': {
        borderColor: '#afafaf',
      },
    },
  },
})(TextField);

function SearchBar() {

  return (
    <CustomSearchField
      label="Search"
      variant="outlined"
      id="custom-css-outlined-input" size="small" style={{ margin: '16px',}}

      /* styles the input component */
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        ),
      }}

      InputLabelProps={{
        style: { color: '#000' },
      }}
    />

  );
}

export default App;
