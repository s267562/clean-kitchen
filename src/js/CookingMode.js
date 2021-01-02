import '../css/CookingMode.css';

import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Card, CardContent, Typography, Dialog, Box, LinearProgress, Grid } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import MicIcon from '@material-ui/icons/Mic';

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
        backgroundColor: '#1a90ff',
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
        margin: 'auto',
        borderRadius: '8px',
        boxShadow: '0px 0px 16px rgba(34, 35, 58, 0.4)',
        objectFit: 'cover',
        objectPosition: 'center',
    },
});

function CookingMode() { // Rule 2: call hooks in function component

    const [debugMsg, setDebugMsg] = useState("");

    /* API CALL - set up
    React.useEffect(() => {    
        fetch(`backend url`)
          .then(results => results.json())
          .then(data => {
              /// DO SOMETHING
          });
    }, []); */

    /* Speech recognition */
    const [success, setSuccess] = useState(false);
    const commands = [
        {
            command: ['cancel', 'next', 'back', 'exit', 'up', 'down'], /* I grouped all together because I want to add a short delay (TIMEOUT) before performing the command --> no repetition of code (delay) */
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
                        case 'exit':
                            exit();
                            break;
                        case 'up':
                            up();
                            break;
                        case 'down':
                            down();
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
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    /* Util functions */
    const exit = () => {
        // TODO - exit cooking mode
    }
    const up = () => {
        // TODO - scroll up
    }
    const down = () => {
        // TODO - scroll down
    }

    /* Render */
    return (<>
        <p>{debugMsg}</p>
        {/* <CookingModeCard stepNumber={activeStep} /> */}
        <Recipe currentStep={activeStep} steps={5} />
        <Stepper steps={5} activeStep={activeStep} next={handleNext} back={handleBack} />
        <SpeechRecognitionDialog transcript={transcript} open={open} listening={listening} success={success} exitedFun={() => setSuccess(false)} />
    </>
    )
}

function Recipe(props) {
    const stepsDescription = [
        'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.',
        'Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.',
        'Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)',
        'Set aside off of the heat to let rest for 10 minutes, and then serve.'
    ];

    const { currentStep, steps } = props;
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <img src="https://www.donnamoderna.com/content/uploads/2014/12/Paella-mista-carne-pesce.jpg" className={classes.media} />

            <Box aria-label="step number" style={{ display: 'flex', flexDirection: 'row', marginTop: '16px', marginBottom: '8px' }}>
                <Typography variant="body1"
                    style={{ fontSize: '0.8rem' }}>
                    {`Step ${currentStep + 1}`}&nbsp;
                </Typography>
                <Typography variant="body1"
                    style={{ color: '#757575', fontSize: '0.8rem' }}>
                    {` of ${steps}`}
                </Typography>
            </Box>

            <Typography variant="body1">
                {stepsDescription[currentStep]}
            </Typography>

            <Typography variant="overline" style={{ color: '#757575', fontSize: '0.7rem', marginTop: '16px' }}>
                INGREDIENTS
            </Typography>

            <Grid container style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                <Ingredient ingredient={{ name: 'Sale', quantity: '8', unity: 'grams' }} />
            </Grid>
        </Grid >
    );
}

function Ingredient(props) {
    const { ingredient } = props;

    return (
        <>
            <Typography variant="body1"
                style={{ color: '#757575', fontSize: '0.8rem' }}
                gutterBottom>
                {`${ingredient.quantity} ${ingredient.unity}`}&nbsp;
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
    const { steps, activeStep, next, back } = props;

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
                <Button size="medium" onClick={back} disabled={activeStep === 0}>
                    <KeyboardArrowLeft />
                </Button>
                <Box width="100%" style={{ marginLeft: '8px', marginRight: '8px' }} >
                    <BorderLinearProgress variant="determinate" value={((activeStep + 1) / (steps + 1)) * 100} />
                </Box>
                <Button size="medium" onClick={next} disabled={activeStep === steps}>
                    <KeyboardArrowRight />
                </Button>
            </Box>
        </div>
    )
}

function SpeechRecognitionDialog(props) {
    const { listening, transcript, open, success, exitedFun } = props;
    return (
        <Dialog open={open} fullWidth="true" maxWidth="xl" onExited={() => exitedFun()}>
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

export default CookingMode;