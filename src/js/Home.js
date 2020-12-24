import { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import 'fontsource-roboto';


const useStyles = makeStyles({
    root: {
        overflowY: "hidden",
        overflowX: "scroll",
        alignItems: "safe center",
        paddingBottom: 16,
    },
    cardsCategoryScrollView: {
        justifyContent: "space-between",
        flexFlow: "row",
        scrollbarWidth: "none",
    },
    cardsCategory: {
        width: 85,
        height: 85,
        margin: 8,
        padding: 8,
        borderRadius: 18,
        minWidth: 56,
        background: `radial-gradient(circle, rgba(251,179,63,0.9415967070421919) 0%, rgba(252,70,107,1) 100%)`,
        backgroundColor: "rgb(63,94,251)", /*this your primary color*/
    },
    mediaCategory: {
        height: 64,
        padding: 4,
    },
    categories: {
       padding: 0,
       textAlign: "center",
    },
    searchContainer: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
    },
    cardsSuggestionContentScrollView: {
        flexFlow: "row",
    },
    cardSuggestion: {
        minWidth: 300,
        height: 185,
        position: 'relative',
        margin: 8,
        borderRadius: 16,
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: '100%',
            height: '70%',
            bottom: 0,
            zIndex: 1,
            background: 'linear-gradient(to top, #000, rgba(0,0,0,0))',
        },
    },
    suggestionContent: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        width: '100%',
    },
    mediaSuggestion: {
        height: "100%",
    },
    suggestionTitle: {
        display: "flex",
        flexGrow: 0,
        paddingLeft: 8,
        flexFlow: "row",
    },
    suggestionTitleTxt: {
        color: "#FFFFFF",
        margin: 0, 
    },
    categoriesTitleTxt: {
        color: "#FFFFFF",
        margin: 0,
        fontSize: "0.7rem", 
        marginBottom: "0.35em", 
    },
    paperSearch:{
        flexGrow: 1,
    },

});
class Home extends Component {

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
            <SearchBar />
            <CategoryGrid />
            <SuggestionContentTitle />
            <SuggestionGrid />
            <SuggestionContentTitle />
            <SuggestionGrid />
        </>
    }
}

export function CategoryCard() {
    const classes = useStyles();

    return (
        <Card elevation={8} className={classes.cardsCategory}>
                <CardMedia
                    className={classes.mediaCategory}
                    image="/res/images/croissant.png"
                    title="Breakfast"
                />
            <CardContent className={classes.categories}>
            <Typography variant="button" component="h2" className={classes.categoriesTitleTxt}>
                    Breakfast
            </Typography>
            </CardContent>
        </Card>
    );
}

export function CategoryGrid() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs>
                <Grid container className={classes.cardsCategoryScrollView}>
                    {[0, 1, 2, 3, 4].map((value) => (
                        <Grid key={value} item>
                            <CategoryCard />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export function SuggestionCard() {
    const classes = useStyles();

    return (
        <Card elevation={8} className={classes.cardSuggestion}>
            <CardMedia
                className={classes.mediaSuggestion}
                image="/res/images/carbonara.jpg"
                title="Pasta alla Carbonara"
            />
            <CardContent className={classes.suggestionContent}>
                <Typography gutterBottom variant="h5" component="h2" className={classes.suggestionTitleTxt}>
                    Pasta alla Carbonara
            </Typography>
            </CardContent>
        </Card>
    );
}

export function SuggestionGrid() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs>
                <Grid container className={classes.cardsSuggestionContentScrollView}>
                    {[0, 1, 2].map((value) => (
                        <Grid key={value} item>
                            <SuggestionCard />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export function SearchBar() {
    const classes = useStyles();

    return (
        <div className={classes.searchContainer}>
             <Paper elevation={3} className={classes.paperSearch}>
            <TextField id="outlined-search" label="Search" type="search" variant="outlined" fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />
            </Paper>
        </div>
    );
}

export function SuggestionContentTitle() {
    const classes = useStyles();

    return (
        <div className={classes.suggestionTitle}>
            <img src={"res/images/fire.png"} width="32" alt="fire"/>
            <Typography variant="h6" component="h2">
                Popular
      </Typography>
        </div>
    );
}
export default Home;