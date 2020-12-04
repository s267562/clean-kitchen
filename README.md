# Clean Kitchen

## Test Implementation

This is a test implementation of both Web Speech and Proximity Events APIs, based on this [MDN demo](<https://github.com/mdn/web-speech-api>).

## Phone Setup

* Download latest Firefox Beta
    * This is currently only available on Android, as iOS Beta program is full
    * This is necessary to use the Proximity Events API
    * Speech Recognition should work on both Firefox and Chrome
* Type *about:config* in the address bar and enter

Set the following entries to **`true`**:

| Entry | Info |
|:---:|:---:|
| `device.sensors.proximity.enabled` | Enable the proximity sensor |
| `media.getusermedia.insecure.enabled` | Enable the microphone on http (if needed) |
| `media.webspeech.recognition.enable` | Enable Web Speech recognition API |
| `media.webspeech.recognition.force_enable` | Enable Web Speech recognition API |

## Development Resources

* [Web Speech API](<https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API>)
* [Speech Recognition Interface](<https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition>)
* [Web Speech API Tutorial](<https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API>)
* [Web Speech API Tutorial on Github](<https://github.com/mdn/web-speech-api>)
* [Proximity Events API](<https://developer.mozilla.org/en-US/docs/Web/API/Proximity_Events>)
* [Proximity Events API Tutorial](<https://hacks.mozilla.org/2013/06/the-proximity-api/>)

## How to test

* Download python
* Download ngrok
* Start a python webserver: ```python -m http.server port_number```
* Start ngrok tunnel: ```ngrok http ip_address:port_number``` where ```ip_address``` is the IP address of your device running the python webserver
* Connect to the provided `https` link
