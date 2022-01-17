import { useEffect, useState } from "react";
import axios from 'axios'


const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState(null)

  let dict = {
    "action" : "28",
    "adventure": "12",
    "animation": "16",
    "comedy": "35",
    "crime": "80",
    "documentary": "99",
    "drama": "18",
    "family": "10751",
    "fantasy": "14",
    "history": "36",
    "horror": "27",
    "music": "10402",
    "mystery": "9648",
    "romance": "10749",
    "science fiction": "878",
    "tv movie": "10770",
    "thriller": "53",
    "war": "10752",
    "western": "37"
  }

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      //FileSaver.saveAs(e.data, "example.flac");
      var bodyFormData = new FormData();
      bodyFormData.append('audio', e.data);
      console.log("here")
      axios({
        method: "post",
        url: "http://localhost:3200/post",
        data: bodyFormData,
        crossDomain:true,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          // Returns a random number:
          let genre = response.data.toLowerCase()
          console.log(genre)
          setGenre(genre);
          let genre_id = dict[genre]
          console.log(genre_id)
          let random = Math.random() * 100
          if (genre_id != undefined){
            axios({
              method: "get",
              url: "https://api.themoviedb.org/3/discover/movie?api_key=2591e25b7adbddf2e2b6c55c4800c33c&with_genres=" + genre_id  + "&page=" + random
            })
            .then(function (response) {
              setMovies(response.data.results)
              console.log(response.data.results)
            })
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        }); 

      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return [audioURL, isRecording, startRecording, stopRecording, movies, genre];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, sampleRate: 48000 });
  return new MediaRecorder(stream);
}
export default useRecorder;
