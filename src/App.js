import { Component } from 'react';
import './css/App.css';
import CookingMode from './js/CookingMode';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Home from './js/Home';
import Tutorial from './js/Tutorial';
import Search from './js/Search';
import Recipe from './js/Recipe';

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

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = (event, index) => {
    console.log("handleClose - " + settingOptions[index]);
    this.setState({
      anchorEl: null
    });
  };

  render() {
    return (
      <Router>
        <AppBar position="sticky">
          <Toolbar >
            <Typography variant="h6" style={{ flexGrow: 1 }} >
              Clean Kitchen
            </Typography>
            <IconButton edge="end" color="inherit" onClick={this.handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="setting-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              {settingOptions.map((option, index) => (
                <MenuItem
                  key={option}
                  onClick={(event) => this.handleClose(event, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/tutorial">
            <Tutorial />
          </Route>
          <Route path="/search"> { /* field keyword (/:keyword)*/}
            <Search />
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

export default App;
