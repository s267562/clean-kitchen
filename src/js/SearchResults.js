import { React, useEffect } from 'react';
import { Box, Card, CardMedia, Divider, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import EuroIcon from '@material-ui/icons/Euro';
import TimerIcon from '@material-ui/icons/Timer';
import TuneIcon from '@material-ui/icons/Tune';
import { useLocation } from "react-router-dom";

const recipes = [
    {
        id: "r0",
        title: "Spaghetti alla carbonara",
        difficulty: "Easy",
        cost: "Low",
        duration: "20",
        overviewImg: "https://images.lacucinaitaliana.it/gallery/82287/Big/f80628f9-ec45-4ac9-8963-e54d9775ddf1.jpg",
    },
    {
        id: "r1",
        title: "Spaghetti all'amatriciana",
        difficulty: "Easy",
        cost: "Low",
        duration: "35",
        overviewImg: "https://www.negroni.com/sites/negroni.com/files/styles/scale__1440_x_1440_/public/bucatini-amatriciana-ricetta-originale.jpg?itok=sFKnqq8_",
    },
    {
        id: "r2",
        title: "Spaghetti alle vongole",
        difficulty: "Easy",
        cost: "Medium",
        duration: "40",
        overviewImg: "https://www.giallozafferano.it/images/219-21925/Spaghetti-alle-vongole_450x300.jpg",
    },
    {
        id: "r3",
        title: "Lasagne alla Bolognese",
        difficulty: "Medium",
        cost: "Low",
        duration: "300",
        overviewImg: "https://www.giallozafferano.it/images/229-22941/Lasagne-alla-Bolognese_450x300.jpg",
    },
    {
        id: "r4",
        title: "Risotto allo zafferano",
        difficulty: "Medium",
        cost: "Medium",
        duration: "30",
        overviewImg: "https://www.giallozafferano.it/images/174-17481/Risotto-allo-Zafferano_450x300.jpg",
    },
    {
        id: "r5",
        title: "Paella de marisco",
        difficulty: "Medium",
        cost: "High",
        duration: "95",
        overviewImg: "https://www.giallozafferano.it/images/213-21310/Paella-de-marisco_450x300.jpg",
    },
    {
        id: "r6",
        title: "Spätzle di spinaci con speck e panna",
        difficulty: "Easy",
        cost: "Low",
        duration: "30",
        overviewImg: "https://www.giallozafferano.it/images/221-22170/Spatzle-di-spinaci_450x300.jpg",
    },
]

const StyledRating = withStyles({
    iconFilled: {
        color: '#ff6d75',
    },
    iconHover: {
        color: '#ff3d47',
    },
})(Rating);

const useStyles = makeStyles(() => ({
    card: {
        borderRadius: '0px',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px',
        marginBottom: '4px',
        marginTop: '4px',
        height: '128px',
    },

    media: {
        height: '100%',
        minWidth: '150px',
        borderRadius: '8px',
        boxShadow: '0px 0px 16px rgba(34, 35, 58, 0.3)',
    },
}));

function SearchResults() {

    const location = useLocation();

    useEffect(() => {
        console.log(location.state.query);
    }, [location]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            style={{ marginBottom: "8px" }}
        >
            <Button
                style={{ padding: '16px', margin: 'auto' }}
                startIcon={<TuneIcon />}
            >
                Filter
            </Button>
            {
                recipes.map((recipe) =>
                    <Recipe key={recipe.id} recipe={recipe} />
                )
            }
        </Box>
    );
}

function Recipe(props) {
    const { recipe } = props;
    const styles = useStyles();

    const onCardClick = () => {
        console.log("onCardClick() - " + recipe.title);
    }

    return (
        <Card className={styles.card} onClick={onCardClick}>
            <CardMedia
                className={styles.media}
                image={recipe.overviewImg}
            />
            <Grid container direction="column" justify="space-between" alignItems="stretch" style={{ overflow: 'hidden', height: "100%", marginLeft: "16px", paddingTop: '8px', paddingBottom: '8px' }} >
                <Grid item>
                    <Typography style={{ fontSize: 16, fontWeight: 'bold', lineHeight: '24px', maxHeight: '48px', overflow: 'hidden' }} color="textPrimary">
                        {recipe.title}
                    </Typography>
                </Grid>
                <Grid item>
                    <Box display="flex" flexDirection="row" style={{ marginTop: "8px", marginBottom: '8px' }}>
                        <Typography style={{ fontSize: '0.9em' }} color="textSecondary"> Difficulty:&nbsp; </Typography>
                        <Typography style={{ fontSize: '0.9em' }} color="textPrimary"> {recipe.difficulty} </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row">
                        <TimerIcon fontSize="small" style={{ marginRight: '8px' }} />
                        <Typography style={{ fontSize: '0.9em' }}> {recipe.duration} min </Typography>
                        <Divider orientation="vertical" style={{ marginLeft: '8px', marginRight: '8px', height: "21px" }} />
                        <StyledRating
                            name="cost-rating"
                            readOnly
                            max={3}
                            value={getRecipeCost(recipe)}
                            icon={<EuroIcon fontSize="small" />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Card >
    );
}

function getRecipeCost(recipe) {
    switch (recipe.cost) {
        case 'Low':
            return 1;
        case 'Medium':
            return 2;
        case 'High':
            return 3;
        default:
            return 0;
    }
}

export default SearchResults;