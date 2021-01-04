import { React, useEffect, useState, forwardRef } from 'react';
import { Box, Card, CardMedia, Divider, Grid, Typography, Button, Slide, Dialog, IconButton, Slider, DialogTitle, DialogContent, DialogActions, FormControl, FormGroup, Checkbox, FormControlLabel } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import EuroIcon from '@material-ui/icons/Euro';
import TimerIcon from '@material-ui/icons/Timer';
import TuneIcon from '@material-ui/icons/Tune';
import API from './API';
import LoadingComponent from './LoadingComponent';
import CloseIcon from '@material-ui/icons/Close';

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

    dialogDivider: {
        marginTop: '16px',
        marginBottom: '16px',
    }
}));

function SearchResults() {
    const location = useLocation();
    const [searchResults, setSearchResults] = useState(null);
    const [query, setQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        //console.log("useEffect (SearchResults.js) - query: " + location.state?.query);
        setQuery(location.search.replace('?query=', ''));
    }, [location]);

    useEffect(() => {
        if (query !== '') {
            API.getSearchResults(query)
                .then(recipes => {
                    setSearchResults(recipes);
                })
        }
    }, [query]);

    const handleFilterClick = () => {
        setFilterOpen(true);
    }

    if (searchResults === null) {
        return <LoadingComponent />
    } else if (searchResults.length > 0) {
        return (
            <>
                <Box
                    display="flex"
                    flexDirection="column"
                    style={{ marginBottom: "8px" }}
                >
                    <Button
                        style={{ padding: '16px', margin: 'auto' }}
                        startIcon={<TuneIcon />}
                        onClick={handleFilterClick}
                    >
                        Filter
                    </Button>
                    {
                        searchResults.map((recipe) =>
                            <Recipe key={recipe.id} recipe={recipe} />
                        )
                    }
                </Box>
                <FilterDialog open={filterOpen} setOpen={setFilterOpen} />
            </>
        );
    } else {
        return (
            <div style={{ height: 'calc(100% - 128px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '16px', marginLeft: '16px' }}>
                <img src='/res/images/noresults.png' alt='no results' />
                <Typography variant="h4">No results found</Typography>
                <Typography style={{ color: '#757575', marginTop: '16px', textAlign: 'center' }} >Try adjusting your search or filter to find what you're searching for.</Typography>
            </div>
        )
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
                            value={recipe.cost}
                            icon={<EuroIcon fontSize="small" />}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Card >
    );
}

const CustomSlider = withStyles({
    root: {
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'none',
        },
    },
    track: {
        height: 4,
    },
    rail: {
        height: 4,
    },

})(Slider);

function FilterDialog(props) {
    const classes = useStyles();
    const { open, setOpen } = props;
    const [value, setValue] = useState([15, 60]);
    const [difficulty, setDifficulty] = useState({ easy: false, medium: false, hard: false });
    const [cost, setCost] = useState({ low: false, medium: false, high: false });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleDifficultyChange = (event) => {
        setDifficulty({ ...difficulty, [event.target.name]: event.target.checked });
    };

    const handleCostChange = (event) => {
        setCost({ ...cost, [event.target.name]: event.target.checked });
    };

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>

            <DialogTitle>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Typography variant="overline" style={{ fontSize: '1.1rem' }}>
                        Time range
                    </Typography>
                    <Typography variant="overline" style={{ color: '#757575' }}>
                        {`${value[0]} - ${value[1]}${value[1] === 200 && '+' || ''} min.`}
                    </Typography>
                    <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
                        <CustomSlider
                            value={value}
                            onChange={handleChange}
                            color="secondary"
                            min={0}
                            step={5}
                            max={200}
                            style={{}}
                        />
                    </div>
                    <Divider className={classes.dialogDivider} />

                    <Typography variant="overline" style={{ fontSize: '1.1rem' }}>
                        Difficulty
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={difficulty.easy} onChange={handleDifficultyChange} name="easy" />}
                                label="Easy"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={difficulty.medium} onChange={handleDifficultyChange} name="medium" />}
                                label="Medium"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={difficulty.hard} onChange={handleDifficultyChange} name="hard" />}
                                label="Hard"
                            />
                        </FormGroup>
                    </FormControl>
                    <Divider className={classes.dialogDivider} />

                    <Typography variant="overline" style={{ fontSize: '1.1rem' }}>
                        Cost
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup>
                            <Box display="flex">
                                <Box display="flex" flexDirection="column">
                                    <FormControlLabel
                                        control={<Checkbox checked={cost.low} onChange={handleCostChange} name="low" />}
                                        label="Low"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={cost.medium} onChange={handleCostChange} name="medium" />}
                                        label="Medium"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={cost.high} onChange={handleCostChange} name="high" />}
                                        label="High"
                                    />
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <div style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                                        <EuroIcon color="secondary" fontSize="small" />
                                    </div>
                                    <div style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                                        <EuroIcon color="secondary" fontSize="small" />
                                        <EuroIcon color="secondary" fontSize="small" />
                                    </div>
                                    <div style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                                        <EuroIcon color="secondary" fontSize="small" />
                                        <EuroIcon color="secondary" fontSize="small" />
                                        <EuroIcon color="secondary" fontSize="small" />
                                    </div>
                                </Box>
                            </Box>
                        </FormGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button variant="text" color="secondary">
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default SearchResults;