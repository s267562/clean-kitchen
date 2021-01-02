import { Component, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Rating } from '@material-ui/lab';
import EuroIcon from '@material-ui/icons/Euro';
import TimerIcon from '@material-ui/icons/Timer';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import ListItemText from '@material-ui/core/ListItemText';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const recipes =
{
    id: "r0",
    title: "Spaghetti alla Carbonara",
    difficulty: "Easy",
    description: "Crispy oven-fried chicken gives you all of the flavor of traditional fried chicken but without the deep-fried guilt.",
    cost: 1,
    duration: "20",
    overviewImg: "./res/images/carbonara.jpg",
    yield: "4",
    ingredients: [
        {
            "name": "Pasta",
            "quantity": 400,
            "unit": "g"
        },
        {
            "name": "Guanciale",
            "quantity": 200,
            "unit": "g"
        },
        {
            "name": "Egg's Yolk",
            "quantity": 5,
            "unit": ""
        },
        {
            "name": "Pecorino",
            "quantity": 100,
            "unit": "g"
        },
    ]
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'safe center',
    },
    itemMedia: {
        width: '100%',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    media: {
        maxHeight: '200px',
        width: '100%',
        borderRadius: 0,
        objectFit: 'cover',
        objectPosition: 'center',
    },
    itemTitle: {
        width: '100%'
    },
    paperTitle: {
        height: 'min-content',
        width: '100%',
        borderRadius: 0,
        marginBottom: 4,
    },
    infoTitle: {
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
    headerIngredients: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'min-content',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 0,
        borderRadius: 0,
    },
    listIngredients: {
        paddingLeft: 0,
        paddingRight: 16,
    }
});

const StyledRating = withStyles({
    iconFilled: {
        color: '#ff6d75',
    },
    iconHover: {
        color: '#ff3d47',
    },
})(Rating);

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
        return (<>

            <RecipeOverview key={recipes.id} recipe={recipes} />
            <Fab variant="extended" color='secondary' style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
            }}>
                Let's cook!
            </Fab>
        </>
        );
    }
}

function RecipeOverview(props) {
    const { recipe } = props;
    const classes = useStyles();
    const [id, setId] = useState('');

    const location = useLocation();

    useEffect(() => {
        console.log("useEffect (Recipe.js) - id: " + location.state.id);
        setId(location.state.id);
    }, [location]);

    return (
        <Grid container className={classes.root}>
            <Grid key='media' item className={classes.itemMedia}>
                <img src={`${recipe.overviewImg}`} alt='Carbonara' className={classes.media} />
            </Grid>
            <RecipeHeader recipe={recipe} />
            <Ingredients recipe={recipe} />
            <Descriptions recipe={recipe} />
        </Grid>
    );
}

function RecipeHeader(props) {
    const { recipe } = props;
    const classes = useStyles();

    return (
        <Grid key='title' item className={classes.itemTitle}>
            <Paper elevation={0} className={classes.paperTitle}>
                <Typography variant='h5' style={{ paddingTop: '8px', paddingLeft: '16px', paddingRight: '16px', }}>
                    {recipe.title}
                </Typography>
                <Grid container className={classes.infoTitle}>
                    <Typography style={{ display: 'flex', alignContent: 'center' }}>
                        <TimerIcon style={{ paddingRight: '8px' }} /> Time: {recipe.duration} min
                </Typography>
                    <Typography style={{ display: 'flex', alignContent: 'center' }}> Cost
                <StyledRating readOnly style={{ paddingLeft: '8px' }}
                            name="cost-rating"
                            max={3}
                            value={recipe.cost}
                            icon={<EuroIcon fontSize="small" />} />
                    </Typography>
                </Grid>
            </Paper>
        </Grid>
    );
}

function Ingredients(props) {
    const { recipe } = props;
    const classes = useStyles();
    var [currentYield, setYield] = useState(recipe.yield);

    return (
        <Grid key='ingredients' item className={classes.itemTitle}>
            <Paper elevation={0} className={classes.paperTitle}>
                <Grid key='iheader' container className={classes.headerIngredients}>
                    <Typography variant='h6' style={{ paddingRight: '16px', }}>
                        Ingredients
                     </Typography>
                    <Box aria-label="servings group"
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <ButtonGroup
                            orientation="vertical"
                            color="#000"
                            aria-label="increase/decrease group"
                            variant="text"
                            size='small'
                        >
                            <IconButton aria-label="increase" onClick={() => { if (currentYield < 100) { setYield(++currentYield) } }} >
                                <ArrowUpIcon />
                            </IconButton>

                            <IconButton aria-label="decrease" onClick={() => { if (currentYield > 1) { setYield(--currentYield) } }}>
                                <ArrowDownIcon />
                            </IconButton>
                        </ButtonGroup>

                        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '8px' }}>
                            <Typography variant="h6"
                                style={{ lineHeight: '1.3' }}>
                                {currentYield}
                            </Typography>
                            <Typography variant="overline"
                                style={{ color: '#757575', fontSize: '0.7rem', lineHeight: '1' }}>
                                servings
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid key='iheader' container className={classes.listIngredients}>
                    <Typography variant='body' style={{ paddingRight: '16px', }}>
                        <IngredientsList recipe={recipe} currentYield={currentYield} />
                    </Typography>
                </Grid>
            </Paper>
        </Grid>
    );
}

function IngredientsList(props) {
    const { recipe, currentYield } = props;
    const classes = useStyles();

    return (
        <List dense style={{ paddingTop: '0' }}>
            {recipe.ingredients.map((value) => {
                return (
                    <ListItem>
                        <ListItemText primary={<span>{Math.round((value.quantity * currentYield) / 4)}  {value.unit} <b> {value.name} </b>  </span>} />
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
        <Grid key='title' item className={classes.itemTitle}>
            <Paper elevation={0} className={classes.paperTitle}>
                <Typography variant='h6' style={{ paddingTop: '8px', paddingLeft: '16px', paddingRight: '16px', }}>
                    Description
            </Typography>
                <Typography variant='body1' style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '16px', paddingRight: '16px', }}>
                    {recipe.description}
                </Typography>
            </Paper>
        </Grid>
    );
}

export default Recipe;
