import { Component, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

class CookingMode extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return <>
            <Rec />
        </>;
    }
}

function Rec() { // Rule 2: call hooks in function component

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