import {Container, Row, Col, ListGroup} from 'react-bootstrap'
import useRecorder from "./useRecorder";
import { useEffect } from "react";
function App() {
  let [audioURL, isRecording, startRecording, stopRecording, movies, genre] = useRecorder();  
  let content = movies.map((i) => {
    const val= Object.values(i)[0];
    return (<li>{i.original_title}</li>)
  });

  return (
    <Container>
  <Row>
    <Col xs={3}> </Col>  
    <Col xl>
      <Row>
        <b style={{fontSize:30, paddingTop:100}}>What kind of movie do you want to watch?</b>
        <p style={{paddingRight:100}}>
        <em>
          say one of genres: action, adventure, animation, comedy, crime, documentary, drama, family, fantasy,
          history, horror, music, mystery, romance, science fiction, tv movie, thriller, war, western
        </em>
      </p>
      <div className="App" style={{paddingTop:20, paddingLeft:100}}>
      <button style={{fontSize:30}} onClick={startRecording} disabled={isRecording}>
        press to say
      </button>
      <button style={{fontSize:30}} onClick={stopRecording} disabled={!isRecording}>
        press to stop
      </button>
      <br></br>
      <b>genre: {genre}</b>
      {content}
    </div>
      </Row>
    </Col>
  </Row>
</Container>
  );
}

export default App;
