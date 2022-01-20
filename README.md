# movie-recommender

this is an application which recommends movies based on user's microphone input.

nodejs version >= 12 and npm version >= 8 is required. Necessary node_modules should be installed with "npm install" 

To use google cloud speech-to-text service, credential is required.
backend.js is backend code. It can be run via "GOOGLE_APPLICATION_CREDENTIALS=<path-to-speech-to-text-key.json> node backend.js" It listens port 3200.

frontend code is inside src folder. It can be run with "npm start"
