import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Rating } from '@material-ui/lab';
import EuroIcon from '@material-ui/icons/Euro';
import TimerIcon from '@material-ui/icons/Timer';

const recipes =
{
    id: "r0",
    title: "Spaghetti alla Carbonara",
    difficulty: "Easy",
    cost: "1",
    duration: "20",
    overviewImg: "./res/images/carbonara.jpg",
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'safe center',
    },
    itemMedia: {
        width: '100%',
        padding: 16,
    },
    media: {
        maxHeight: '20%',
        width: '100%',
        borderRadius: 12,
        objectFit: 'cover',
        objectPosition: 'center',
    },
    itemTitle: {
        width: '100%'
    },
    paperTitle: {
        height: 'min-content',
        width: '100%',
        borderRadius: 0
    },
    infoTitle: {
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
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
        </>
        );
    }
}

function RecipeOverview(props) {
    const { recipe } = props;
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid key='media' item className={classes.itemMedia}>
                <img src={`${recipe.overviewImg}`} alt='Carbonara' className={classes.media} />
            </Grid>
            <Grid key='title' item className={classes.itemTitle}>
                <Paper elevation={0} className={classes.paperTitle}>
                    <Typography variant='h5' style={{ paddingTop: '16px', paddingLeft: '16px', paddingRight: '16px', }}>
                        {recipe.title}
                    </Typography>
                    <Grid container className={classes.infoTitle}>
                        <Typography style={{display: 'flex', alignContent: 'center'}}>
                            <TimerIcon style={{paddingRight: '8px'}}/> Time: {recipe.duration} min
                        </Typography>
                        <Typography style={{display: 'flex', alignContent: 'center'}}> Cost
                        <StyledRating readOnly style={{paddingLeft: '8px'}}
                            name="cost-rating"
                            max={3}
                            value={recipe.cost}
                            icon={<EuroIcon fontSize="small" />} />
                            </Typography>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Recipe;