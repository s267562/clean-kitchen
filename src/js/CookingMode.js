import { Component, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { MobileStepper, Button } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

class CookingMode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
        };

        this.onStepChange = this.onStepChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
    }

    onStepChange(command) {
        if (command === 'next') {
            this.setState((prevState) => ({ activeStep: parseInt(prevState.activeStep) + 1 }));
        } else if (command === 'back') {
            this.setState((prevState) => ({ activeStep: parseInt(prevState.activeStep) - 1 }));
        } else {
            /* step number (command) */
            let stepNumber = undefined;
            if (isNaN(command)) {
                switch (command.toLowerCase()) {
                    case 'zero':
                        stepNumber = 0;
                        break;
                    case 'one':
                        stepNumber = 1;
                        break;
                    case 'two':
                        stepNumber = 2;
                        break;
                    case 'three':
                        stepNumber = 3;
                        break;
                    case 'four':
                        stepNumber = 4;
                        break;
                    case 'five':
                        stepNumber = 5;
                        break;
                    case 'six':
                        stepNumber = 6;
                        break;
                    case 'seven':
                        stepNumber = 7;
                        break;
                    case 'eight':
                        stepNumber = 8;
                        break;
                    case 'nine':
                        stepNumber = 9;
                        break;
                    case 'ten':
                        stepNumber = 10;
                        break;
                    default:
                        stepNumber = -1;
                        break;

                }
            } else {
                stepNumber = command;
            }
            this.setState({ activeStep: parseInt(stepNumber) });
        }
    }

    handleNext = () => {
        this.setState((prevState) => ({ activeStep: parseInt(prevState.activeStep) + 1 }));
    };

    handleBack = () => {
        this.setState((prevState) => ({ activeStep: parseInt(prevState.activeStep) - 1 }));
    };

    render() {
        return <>
            <Rec onStepChange={this.onStepChange} />
            <p>Step # {this.state.activeStep}</p>

            <MobileStepper
                variant="progress"
                steps={6}
                position="static"
                activeStep={this.state.activeStep}
                nextButton={
                    <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === 5}>
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
        </>;
    }
}

function Rec(props) { // Rule 2: call hooks in function component
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
            command: ['next', 'back'],
            callback: (({ command }) => props.onStepChange(command))
        },
        {
            command: ['Step *'],
            callback: ((step) => props.onStepChange(step))
        }
    ];
    const { transcript, listening } = useSpeechRecognition({ commands }) // Rule 1: call hooks in top-level

    /* Proximity sensor */
    function handleProximity(e) {
        if (e.near) {
            SpeechRecognition.startListening();
        }
    }
    window.addEventListener('userproximity', handleProximity);

    return (
        <div>
            <h1>Speech recognition: {listening ? 'ON' : 'OFF'}</h1>
            <p>{message}</p>
            <p>{transcript}</p>
        </div>
    )
}

export default CookingMode;