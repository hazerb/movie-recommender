var express = require('express');
const speech = require('@google-cloud/speech');
const fs = require('fs');
var app = express();
const http = require("http").createServer(app);
const client = new speech.SpeechClient();
const bodyParser =  require("body-parser");
const { exec } = require('child_process');
var multer = require('multer');
var upload = multer();

const cors = require("cors")
app.use(cors())

const port = 3200;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, "test" + '.flac')
  }
})

var upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let genre;
const request = {
  config: {
    encoding: 'FLAC',
    sampleRateHertz: 48000,
    languageCode: 'en-US'
  },
  interimResults: false,
};

var type = upload.single('audio')

app.use(express.static('public'));
app.post('/post', type, async function(req,res){
  await exec('ffmpeg -i uploads/test.flac -ac 1 uploads/input.flac');
  const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => {
    genre = data.results[0].alternatives[0].transcript
    exec('rm -f uploads/test.flac');
    exec('rm -f uploads/input.flac');
    res.send(genre)
  });
  
  setTimeout(async function (){
     await fs.createReadStream('uploads/input.flac').pipe(recognizeStream);
}, 1000);
})

http.listen(port, () => console.log("App listening at port", port))


