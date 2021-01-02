import '../css/CookingMode.css';

import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button, Typography, Dialog, Box, LinearProgress, Grid, List, ListItem } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MicIcon from '@material-ui/icons/Mic';
import SwipeableViews from 'react-swipeable-views';

const TIMEOUT = 1000; /* Timeout to keep the dialog (microphone) open for [N] seconds after speech recognition end --> show result (feedback) */


const recipe_test = {
    id: "r0",
    title: "Crispy Oven-Fried Chicken",
    description: "Crispy oven-fried chicken gives you all of the flavor of traditional fried chicken but without the deep-fried guilt.",
    overviewImg: "https://www.savorynothings.com/wp-content/uploads/2019/05/crispy-oven-fried-chicken-image-hero.jpg",
    rating: "4",
    duration: "75",
    price: "Low",
    difficulty: "Medium",
    yield: "4",
    ingredients: [
        {
            name: "buttermilk",
            quantity: "237",
            unit: "milliliters"
        },
        {
            name: "chicken legs",
            quantity: "8",
            unit: ""
        },
        {
            name: "all-purpose flour",
            quantity: "63",
            unit: "g"
        },
        {
            name: "paprika",
            quantity: "1",
            unit: "tsp"
        },
        {
            name: "garlic powder",
            quantity: "1/2",
            unit: "tsp"
        },
        {
            name: "baking powder",
            quantity: "1",
            unit: "tsp"
        },
        {
            name: "fine sea salt",
            quantity: "1",
            unit: "tsp"
        },
        {
            name: "black pepper",
            quantity: "1",
            unit: "tsp"
        },
        {
            name: "olive oil cooking spray (as needed)",
            quantity: "",
            unit: ""
        },
        {
            name: "honey",
            quantity: "170",
            unit: "grams"
        }
    ],
    directionsNumber: 2,
    directions: [
        {
            description: "Preheat the oven to 425°F",
            image: "",
            timer: "",
            ingredients: []
        },
        {
            description: "Place the chicken in a shallow dish and pour the buttermilk over the top. With your hands, rub the buttermilk into the chicken so it is covered. Allow the chicken to sit at room temperature for 30 minutes.",
            image: "https://www.savorynothings.com/wp-content/uploads/2019/05/crispy-oven-fried-chicken-image-hero.jpg",
            timer: "30",
            ingredients: [
                {
                    "name": "buttermilk",
                    "quantity": "237",
                    "unit": "milliliters"
                },
                {
                    "name": "chicken legs",
                    "quantity": "8",
                    "unit": ""
                }
            ]
        }
    ],
    helpWeyword: ""
}

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
        margin: 'auto',
        borderRadius: '8px',
        boxShadow: '0px 0px 16px rgba(34, 35, 58, 0.4)',
        objectFit: 'cover',
        objectPosition: 'center',
    },
});

function CookingMode() { // Rule 2: call hooks in function component

    const classes = useStyles();

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
    const [currentStep, setCurrentStep] = useState(0);
    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    /* swipeableViews */
    const handleStepChange = (step) => {
        setCurrentStep(step);
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
        <SwipeableViews
            enableMouseEvents
            index={currentStep}
            onChangeIndex={handleStepChange} >
            {recipe_test.directions.map((direction, index) => (
                <Grid key={index} container className={classes.root}>
                    {direction.image &&
                        <img src={direction.image} className={classes.media} alt={`step ${currentStep}`} />}

                    <Box aria-label="step number" style={{ display: 'flex', flexDirection: 'row', marginTop: '16px', marginBottom: '8px' }}>
                        <Typography variant="body1"
                            style={{ fontSize: '0.8rem', color: '#ff6d75' }}>
                            {`Step ${currentStep + 1}`}&nbsp;
                            </Typography>
                        <Typography variant="body1"
                            style={{ color: '#757575', fontSize: '0.8rem' }}>
                            {` of ${recipe_test.directionsNumber}`}
                        </Typography>
                    </Box>

                    <Typography variant="body1">
                        {direction.description}
                    </Typography>

                    {direction.ingredients.length > 0 &&
                        <>
                            <Typography variant="overline" style={{ color: '#757575', fontSize: '0.7rem', marginTop: '16px' }}>
                                INGREDIENTS
                            </Typography>
                            <List dense style={{ paddingTop: '0px' }}>
                                {direction.ingredients.map((ingredient) =>
                                    <ListItem key={ingredient.name}>
                                        <Ingredient ingredient={ingredient} />
                                    </ListItem>)}
                            </List>
                        </>}
                </Grid >
            ))}
            <div style={{ padding: "16px", minHeight: '200px', color: '#fff', backgroundColor: '#6AC0FF' }}>FINISH</div>
        </SwipeableViews>
        <Stepper directionsNumber={recipe_test.directionsNumber} currentStep={currentStep} next={handleNext} back={handleBack} />
        <SpeechRecognitionDialog transcript={transcript} open={open} listening={listening} success={success} exitedFun={() => setSuccess(false)} />
    </>
    )
}

function Ingredient(props) {
    const { ingredient } = props;

    return (
        <>
            <Typography variant="body1"
                style={{ color: '#757575', fontSize: '0.8rem' }}
                gutterBottom>
                {`${ingredient.quantity} ${ingredient.unit}`}&nbsp;
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
    const { directionsNumber, currentStep, next, back } = props;

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
                    <BorderLinearProgress variant="determinate" value={((currentStep + 1) / (directionsNumber + 1)) * 100} />
                </Box>
                <Button size="medium" onClick={next} disabled={currentStep === directionsNumber}>
                    <KeyboardArrowRight />
                </Button>
            </Box>
        </div>
    )
}

function SpeechRecognitionDialog(props) {
    const { listening, transcript, open, success, exitedFun } = props;
    return (
        <Dialog open={open} fullWidth={true} onExited={() => exitedFun()}>
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