import { Component } from 'react';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import { Box } from '@material-ui/core';
import "typeface-overpass";
import "typeface-ubuntu";

const customFont = createMuiTheme({
    typography: {
        h6: {
            fontFamily: [
                'Overpass',
                'sans-serif',
            ].join(','),
        },
        h5: {
            fontFamily: [
                'Ubuntu',
                'sans-serif',
            ].join(','),
        },
    },
});

function newGradient() {
    var c1 = {
      r: Math.floor(Math.random()*255),
      g: Math.floor(Math.random()*255),
      b: Math.floor(Math.random()*255)
    };
    var c2 = {
      r: Math.floor(Math.random()*255),
      g: Math.floor(Math.random()*255),
      b: Math.floor(Math.random()*255)
    };
    c1.rgb = 'rgb('+c1.r+','+c1.g+','+c1.b+')';
    c2.rgb = 'rgb('+c2.r+','+c2.g+','+c2.b+')';
    return 'radial-gradient(at top left, '+c1.rgb+', '+c2.rgb+')';
  }
  

const useStyles = makeStyles({
    rootGridScrollView: {
        overflowY: "hidden",
        overflowX: "hidden",
        alignItems: "safe center",
        paddingBottom: 8,
    },
    scrollViewCategory: {
        justifyContent: "space-between",
        flexFlow: "row",
        overflowX: "scroll",
        scrollbarWidth: "none",
        paddingBottom: 8,
    },
    cardCategory: {
        width: 85,
        height: 85,
        margin: 8,
        padding: 8,
        borderRadius: 18,
        minWidth: 56,
        background: newGradient,
        /*background: `radial-gradient(circle, rgba(251,179,63,0.9415967070421919) 0%, rgba(252,70,107,1) 100%)`,*/
        /*backgroundColor: "rgb(63,94,251)", /*this your primary color*/
    },
    mediaCategory: {
        height: 64,
        padding: 4,
    },
    contentCategory: {
       padding: 0,
       textAlign: "center",
    },
    textCategory: {
        color: "#FFFFFF",
        margin: 0,
        fontSize: "0.7rem", 
        marginBottom: "0.35em", 
    },
    scrollViewSuggestion: {
        flexFlow: "row",
        overflowX: "scroll",
        scrollbarWidth: "none",
        padding: 8,
    },
    cardSuggestion: {
        minWidth: 300,
        height: 185,
        position: 'relative',
        margin: 8,
        borderRadius: 12,
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
    mediaSuggestion: {
        height: "100%",
    },
    contentSuggestion: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        width: '100%',
    },
    textSuggestion: {
        color: "#FFFFFF",
        margin: 0, 
        flexWrap: 1,
    },
    headerSuggestion: {
        display: "flex",
        alignItems: "center",
        flexGrow: 0,
        paddingLeft: 8,
        flexFlow: "row",
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
            <GridCategory />
            <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px"}}>
            <HeaderSuggestion title="Popular" icon="fire.png" />
            <GridSuggestion recipe="Pasta alla Carbonara" img="carbonara.jpg" />
            </Paper>
            <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px"}}>
            <HeaderSuggestion title="Editor's Choice" icon="choice.png" />
            <GridSuggestion recipe="Cheesecake" img="cheesecake.jpg" />
            </Paper>
        </>
    }
}

export function CardCategory(props) {
    const classes = useStyles();

    return (
        <Card elevation={8} className={classes.cardCategory}>
                <CardMedia
                    className={classes.mediaCategory}
                image={`/res/images/${props.name}.png`}
                title={props.name}
                />
            <CardContent className={classes.contentCategory}>
                <Typography variant="button" component="h1" className={classes.textCategory}>
                {props.name}
            </Typography>
            </CardContent>
        </Card>
    );
}

export function GridCategory() {
    const classes = useStyles();

    return (
        <Grid container className={classes.rootGridScrollView}>
            <Grid item xs>
                <Grid container className={classes.scrollViewCategory
        }>
                    {["breakfast", "fish", "meat", "vegan", "dessert"].map((value) => (
                        <Grid key={value} item>
                            <CardCategory name={value}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export function CardSuggestion(props) {
    const classes = useStyles();

    return (
        <Card elevation={8} className={classes.cardSuggestion}>
            <CardMedia
                className={classes.mediaSuggestion}
                image={`/res/images/${props.img}`}
                title={props.recipe}
            />
            <CardContent className={classes.contentSuggestion}>
                <ThemeProvider theme={customFont}>
                    <Typography gutterBottom variant="h6" component="h1" className={classes.textSuggestion}>
                        {props.recipe}
            </Typography>
                </ThemeProvider>
            </CardContent>
        </Card>
    );
}

export function GridSuggestion(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.rootGridScrollView}>
            <Grid item xs>
                <Grid container className={classes.scrollViewSuggestion}>
                    {[0, 1, 2].map((value) => (
                        <Grid key={value} item>
                            <CardSuggestion recipe={props.recipe} img={props.img} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export function HeaderSuggestion(props) {
    const classes = useStyles();

    return (
        <div className={classes.headerSuggestion}>
            <img src={`res/images/${props.icon}`} width='26' height='26' alt="fire" />
            <ThemeProvider theme={customFont}>
                <Typography variant ="h5">
                    <Box fontWeight="400"  paddingLeft="8px">
                        {props.title}</Box>
                </Typography>
            </ThemeProvider>
        </div>
    );
}


export default Home;