import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { MobileStepper, Button, Card, CardContent, Typography, Dialog, DialogTitle } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import MicIcon from '@material-ui/icons/Mic';

const TIMEOUT = 1000; /* Timeout to keep the dialog (microphone) open for [N] seconds after speech recognition end --> show result (feedback) */

function CookingMode() { // Rule 2: call hooks in function component

    /* API CALL - set up
    React.useEffect(() => {    
        fetch(`backend url`)
          .then(results => results.json())
          .then(data => {
              /// DO SOMETHING
          });
    }, []); */

    /* Speech recognition */
    const [message, setMessage] = useState('');
    const commands = [
        {
            command: 'I would like to order *',
            callback: (food) => setMessage(`Your order is for: ${food}`)
        },
        {
            command: 'The weather is :condition today',
            callback: (condition) => setMessage(`Today, the weather is ${condition}`)
        },
        {
            command: ['Hello', 'Hi'],
            callback: ({ command }) => setMessage(`Hi there! You said: "${command}"`),
            matchInterim: true
        },
        {
            command: ['next', 'back', 'exit'], /* I grouped all together because I want to add a small delay (TIMEOUT) before performing the command --> no repetition of code (delay) */ 
            callback: ({ command }) => setTimeout(function () {
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
                    default:
                        break;
                }
            }, TIMEOUT)
        }
    ];
    const { transcript, listening } = useSpeechRecognition({ commands }) // Rule 1: call hooks in top-level

    /* Dialog */
    const [open, setOpen] = useState(false);
    SpeechRecognition.getRecognition().onend = function (event) {
        SpeechRecognition.stopListening();
        setTimeout(function () {
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
        setMessage('TODO - exit cooking mode');
    }

    /* Render */
    return (
        <div>
            <p>{message}</p>

            <CookingModeCard stepNumber={activeStep} />

            <MobileStepper
                variant="progress"
                steps={6}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
            <SpeechRecognitionDialog listening={listening} transcript={transcript} open={open} />
        </div>
    )
}

function SpeechRecognitionDialog(props) {
    const { listening, transcript, open } = props;

    return (
        <Dialog open={open}>
            <DialogTitle>Speak now</DialogTitle>
            <MicIcon fontSize="large" color={listening ? 'primary' : 'inherit'} style={{ margin: '0px auto 30px auto' }} />
            {transcript}
        </Dialog>
    );
}

function CookingModeCard(props) {

    const steps = [
        'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.',
        'Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.',
        'Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don’t open.)',
        'Set aside off of the heat to let rest for 10 minutes, and then serve.'
    ]

    return (
        <Card style={{ margin: '16px' }}>
            <CardContent>
                <Typography style={{ fontSize: 14 }} color="textSecondary" gutterBottom>
                    {`Step ${props.stepNumber}`}
                </Typography>
                <Typography variant="h5" component="h2">
                    Shrimp and Chorizo Paella
                </Typography>
                <br />
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                    {steps[props.stepNumber]}
                </Typography>
            </CardContent>

        </Card >
    )
}

export default CookingMode;