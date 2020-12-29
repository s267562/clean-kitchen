import '../css/CookingMode.css';

import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { MobileStepper, Button, Card, CardContent, Typography, Dialog, Box, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import MicIcon from '@material-ui/icons/Mic';

const TIMEOUT = 1000; /* Timeout to keep the dialog (microphone) open for [N] seconds after speech recognition end --> show result (feedback) */

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 8,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

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
            command: ['next', 'back', 'exit', 'up', 'down'], /* I grouped all together because I want to add a short delay (TIMEOUT) before performing the command --> no repetition of code (delay) */
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
        <CookingModeCard stepNumber={activeStep} style={{ position: 'fixed', top: '56px', bottom: '102px', overflow: 'scroll' }} />
        <Stepper steps={5} activeStep={activeStep} next={handleNext} back={handleBack} />
        <SpeechRecognitionDialog transcript={transcript} open={open} listening={listening} success={success} exitedFun={() => setSuccess(false)} />
    </>
    )
}

function CookingModeCard(props) {

    const steps = [
        'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.',
        'Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.',
        'Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)',
        'Set aside off of the heat to let rest for 10 minutes, and then serve.'
    ]

    return (
        <Box style={props.style}>
            <Card style={{ margin: '16px' }}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Shrimp and Chorizo Paella
                </Typography>
                    <br />
                    <img src="https://www.donnamoderna.com/content/uploads/2014/12/Paella-mista-carne-pesce.jpg"
                        style={{ width: "100%" }} />
                    <br />
                    <br />
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                        {steps[props.stepNumber]}
                    </Typography>
                </CardContent>

            </Card >
        </Box>
    )
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
            padding: '16px',
        }}
        >

            <Box display="flex" alignItems="center" style={{ marginBottom: '8px' }}>
                <Box width="100%" mr={2}>
                    <BorderLinearProgress variant="determinate" value={(activeStep / steps) * 100} />
                </Box>
                <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round((activeStep / steps) * 100)}%`}</Typography>
                </Box>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" style={{ width: '100%' }}>
                <Button size="large" onClick={back} disabled={activeStep === 0}>
                    <KeyboardArrowLeft /> Back
                </Button>
                <Typography style={{ fontSize: 14, width: '100%', textAlign: 'center' }} color="textPrimary">
                    {`Step ${activeStep} of ${steps}`}
                </Typography>
                <Button size="large" onClick={next} disabled={activeStep === steps}>
                    Next <KeyboardArrowRight />
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