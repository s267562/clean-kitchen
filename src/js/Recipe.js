import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Component } from 'react';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'safe center',
        padding: 16,
      },
      paperMedia: {
        height: 250,
        width: '100%',
        borderRadius: 12,
      },
});

class Recipe extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <>
                <RecipeOverview />
            </>
    }
}

function RecipeOverview() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item>
              <Paper className={classes.paperMedia}>
                  <img src='./res/images/carbonara.jpg' alt='Carbonara' style={{height: 'inherit', width: 'inherit', borderRadius: 'inherit',}} />
              </Paper>
            </Grid>
    </Grid>
    );
}

export default Recipe;