import { React, useEffect, useState } from 'react';
import { Box, Card, CardMedia, Divider, Grid, Typography, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import EuroIcon from '@material-ui/icons/Euro';
import TimerIcon from '@material-ui/icons/Timer';
import TuneIcon from '@material-ui/icons/Tune';
import API from './API';
import LoadingComponent from './LoadingComponent';


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
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        //console.log("useEffect (SearchResults.js) - query: " + location.state?.query);
        setQuery(location.state?.query);
    }, [location]);

    useEffect(() => {
        if (query !== '') {
            API.getSearchResults(query)
                .then(recipes => {
                    console.log("Search results: " + JSON.stringify(recipes));
                    setSearchResults(recipes);
                })
        }
    }, [query]);

    if (searchResults === null) {
        return <LoadingComponent />
    } else {
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
                    searchResults.map((recipe) =>
                        <Recipe key={recipe.id} recipe={recipe} />
                    )
                }
            </Box>
        );
    }
}

function Recipe(props) {
    const { recipe } = props;
    const styles = useStyles();
    const history = useHistory();

    const onCardClick = () => {
        history.push({
            pathname: '/recipe',
            search: `?id=${recipe.id}`,
            state: { id: recipe.id }
        });
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