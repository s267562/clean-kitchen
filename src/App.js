import { Component } from 'react';
import './App.css';
import CookingMode from './js/CookingMode';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Home from './js/Home';
import Tutorial from './js/Tutorial';
import Search from './js/Search';
import Recipe from './js/Recipe';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Router>
        <MyAppbar />
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

function MyAppbar() {
  return <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" >
        Clean Kitchen
      </Typography>
      <IconButton edge="end" color="inherit" aria-label="menu">
        <MoreVertIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
}

export default App;
