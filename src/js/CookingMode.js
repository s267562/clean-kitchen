import '../css/CookingMode.css';
import { React, useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Typography, Dialog, Box, LinearProgress, Grid, List, ListItem, DialogContent, DialogActions } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MicIcon from '@material-ui/icons/Mic';
import SwipeableViews from 'react-swipeable-views';
import { useHistory, useLocation } from 'react-router-dom';
import API from './API';
import LoadingComponent from './LoadingComponent';

const TIMEOUT = 1000; /* Timeout to keep the dialog (microphone) open for [N] seconds after speech recognition end --> show result (feedback) */

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 2,
        backgroundColor: '#ff6d75',
    },
}))(LinearProgress);

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        flexDirection: 'column',
        padding: '16px',
    },
    media: {
        maxHeight: '300px',
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0px 0px 16px rgba(34, 35, 58, 0.4)',
        objectFit: 'cover',
        objectPosition: 'center',
    },
    paper: { borderRadius: 20 }
});

function CookingMode() { // Rule 2: call hooks in function component

    const classes = useStyles();
    const location = useLocation();

    const [recipe, setRecipe] = useState(null);
    const [currentYield, setCurrentYield] = useState(4);
    const [help, setHelp] = useState(false);

    useEffect(() => {
        const queryParams = location.search.replace('?', '').split('&');
        const id = queryParams[0].replace('id=', '');
        setCurrentYield(queryParams[1].replace('y=', ''));

        API.getRecipe(id)
            .then(recipe => {
                setRecipe(recipe);
            })
    }, [location]);

    useEffect(() => {

    }, []);


    /* Speech recognition */
    const [success, setSuccess] = useState(false);
    const commands = [
        {
            command: ['next', 'back', 'help', 'up', 'down'], /* I grouped all together because I want to add a short delay (TIMEOUT) before performing the command --> no repetition of code (delay) */
            callback: ({ command }) => {
                setSuccess(true); /* successfull speech recognition */
                setTimeout(function () {
                    switch (command) {
                        case 'next':
                            handleNext();
                            break;
                        case 'back':
                            handleBack();
                            break;
                        case 'help':
                            handleHelp();
                            break;
                        case 'up':
                            handleUp();
                            break;
                        case 'down':
                            handleDown();
                            break;
                        default:
                            break;
                    }
                }, TIMEOUT)
            }
        }
    ];
    const { transcript, listening } = useSpeechRecognition({ commands }) // Rule 1: call hooks in top-level

    /* Dialog */
    const [open, setOpen] = useState(false);
    SpeechRecognition.getRecognition().onend = function (event) {
        SpeechRecognition.stopListening();
        setTimeout(() => {
            setOpen(false);
        }, TIMEOUT); /* keep the dialog open for 2 second when the speech recognition has the result */
    };

    /* Proximity sensor */
    function handleProximity(e) {
        if (e.near) {
            setOpen(true);
            SpeechRecognition.startListening();
        }
    }
    window.addEventListener('userproximity', handleProximity);

    /* Stepper */
    const [currentStep, setCurrentStep] = useState(0);
    const handleNext = () => {
        if ((currentStep + 1) !== recipe?.directionsNumber)
            setCurrentStep(currentStep + 1);
        else
            setDone(true);
    };
    const handleBack = () => {
        if (currentStep > 0)
            setCurrentStep(currentStep - 1);
    };

    /* swipeableViews */
    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    /* Util functions */
    const handleUp = () => {
        // TODO - scroll up
    }
    const handleDown = () => {
        // TODO - scroll down
    }

    const handleHelp = () => {
        setHelp(true);
    }

    const [done, setDone] = useState(false);

    /* Render */
    if (recipe === null) {
        // Render loading state ...
        return <LoadingComponent />
    } else {
        return (
            // Render real UI ...
            <>
                <Box
                    display='flex'
                    flexDirection='column'
                    style={{ overflowY: 'scroll', background: '#fafafa', height: 'calc(100% - 56px)' }}>
                    <SwipeableViews
                        enableMouseEvents
                        index={currentStep}
                        style={{ paddingBottom: '52px' }}
                        onChangeIndex={handleStepChange} >
                        {recipe?.directions.map((direction, index) => (
                            <Grid key={index} container className={classes.root} style={{ height: '100%' }}>
                                {direction.image &&
                                    <img src={direction.image} className={classes.media} alt={`step ${currentStep}`} />}
                                <Box aria-label="step number" style={{ display: 'flex', flexDirection: 'row', marginTop: '16px', marginBottom: '8px' }}>
                                    <Typography variant="body1"
                                        style={{ fontSize: '0.8rem', color: '#ff6d75' }}>
                                        {`Step ${currentStep + 1}`}&nbsp;
                                    </Typography>
                                    <Typography variant="body1"
                                        style={{ color: '#757575', fontSize: '0.8rem' }}>
                                        {` of ${recipe?.directionsNumber}`}
                                    </Typography>
                                </Box>

                                <Typography variant="body1">
                                    {direction.description}
                                </Typography>

                                {direction.ingredients.length > 0 &&
                                    <>
                                        <div style={{ marginTop: '16px' }}>
                                            <Typography variant="overline" style={{ fontSize: '0.7rem', marginTop: '16px' }}>
                                                INGREDIENTS -&nbsp;
                                            </Typography>
                                            <Typography variant="overline" style={{ color: '#757575', fontSize: '0.7rem' }}>
                                                {`${currentYield} servings`}
                                            </Typography>
                                        </div>
                                        <List dense style={{ paddingTop: '0px' }}>
                                            {direction.ingredients.map((ingredient) =>
                                                <ListItem key={ingredient.name} >
                                                    <Ingredient ingredient={ingredient} currentYield={currentYield} />
                                                </ListItem>)}
                                        </List>
                                    </>}
                            </Grid >
                        ))}
                    </SwipeableViews>
                    <Stepper directionsNumber={recipe?.directionsNumber} currentStep={currentStep} next={handleNext} back={handleBack} setDone={setDone} />
                </Box>
                <SpeechRecognitionDialog transcript={transcript} open={open} listening={listening} success={success} exitedFun={() => setSuccess(false)} />
                <DoneDialog done={done} setDone={setDone} />
                <HelpDialog open={help} setHelp={setHelp} />
            </>
        );
    }
}

function Ingredient(props) {
    const { ingredient, currentYield } = props;

    return (
        <>
            <Typography variant="body1"
                style={{ color: '#757575', fontSize: '0.8rem' }}
                gutterBottom>
                {`${Math.round((ingredient.quantity * currentYield) / 4)} ${ingredient.unit}`}&nbsp;
            </Typography>
            <Typography variant="body1"
                style={{ fontSize: '0.8rem' }}
                gutterBottom>
                {`${ingredient.name}`}
            </Typography>
        </>
    );
}

function Stepper(props) {
    const { directionsNumber, currentStep, next, back, setDone } = props;

    const handleDone = () => {
        setDone(true);
    }
    return (
        <div style={{
            overflow: 'scroll',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fafafa',
            padding: '8px',
        }}
        >
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" style={{ width: '100%' }}>
                <Button size="medium" onClick={back} disabled={currentStep === 0}>
                    <KeyboardArrowLeft />
                </Button>
                <Box width="100%" style={{ marginLeft: '8px', marginRight: '8px' }} >
                    <BorderLinearProgress variant="determinate" value={((currentStep + 1) / directionsNumber) * 100} />
                </Box>
                {(currentStep + 1) === directionsNumber ?
                    <Button size="medium" onClick={handleDone}>
                        DONE
                    </Button> :
                    <Button size="medium" onClick={next}>
                        <KeyboardArrowRight />
                    </Button>}

            </Box>
        </div>
    )
}

function SpeechRecognitionDialog(props) {
    const { listening, transcript, open, success, exitedFun } = props;
    const classes = useStyles();

    return (
        <Dialog open={open} fullWidth={true} onExited={() => exitedFun()} classes={{ paper: classes.paper }}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={3}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={`circular ${listening ? ' pulse' : success ? ' success' : ' failure'}`}
                >
                    <MicIcon fontSize="large" style={{ color: 'white' }} />
                </Box>

                <Typography paragraph>{transcript !== "" ? transcript : "Speak now"}</Typography>
                <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>english</Typography>
            </Box>
        </Dialog>
    );
}

function DoneDialog(props) {
    const { done, setDone } = props;

    const history = useHistory();
    const classes = useStyles();

    const handleExit = () => {
        history.push({
            pathname: '/',
        });
    }

    const handleClose = () => {
        setDone(false);
    }

    return (
        <Dialog open={done} fullWidth classes={{ paper: classes.paper }} >
            <DialogContent style={{ marginTop: '16px' }}>
                <Typography variant='h5' align='center' style={{ marginBottom: '26px' }}> Well done! <br /> Enjoy your meal! </Typography>
                <Typography variant='body1' align='center' paragraph> Press HOME to go home, <br /> or press UNDO to keep cooking. </Typography>
            </DialogContent>
            <DialogActions style={{ padding: '16px' }}>
                <Button variant='text' color='secondary' onClick={handleClose}>
                    Undo
                </Button>
                <Button variant='contained' color='secondary' onClick={handleExit} style={{ color: 'white', borderRadius: '25px' }}>
                    Home
                </Button>
            </DialogActions>

        </Dialog >
    );
}

function HelpDialog(props) {
    const { open, setHelp } = props;
    const classes = useStyles();

    const handleClose = () => {
        setHelp(false);
    }

    return (
        <Dialog open={open} fullWidth classes={{ paper: classes.paper }} >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={3}
            >
                <Typography variant='h5' align='center' paragraph> HELP SCREEN! </Typography>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' color='secondary' size="small" onClick={handleClose}>
                        close
                    </Button>
                </div>
            </Box >
        </Dialog >
    );
}

export default CookingMode;