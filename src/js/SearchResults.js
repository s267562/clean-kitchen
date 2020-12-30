import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
        cost: "Mow",
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
        title: "Spaghetti alla carbonara",
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

const useStyles = makeStyles(() => ({
    card: {
        // borderRadius: '16px',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px',
        marginBottom: '8px',
        marginTop: '8px',
        marginRight: '8px',
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

    return (
        <Box
            display="flex"
            flexDirection="column"
        >
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

    return (
        <Card className={styles.card} >
            <CardMedia
                className={styles.media}
                image={
                    recipe.overviewImg
                }
            />
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                style={{ height: '100%', width: '100%', marginLeft: '16px' }}
            >
                <Typography style={{ fontSize: 16, fontWeight: 'bold' }} color="textPrimary" gutterBottom>
                    {recipe.title}
                </Typography>
            </Box>
        </Card >
    );
}

export default SearchResults;