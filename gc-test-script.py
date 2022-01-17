import time
import io
import threading
from google.cloud import speech

def transcribe_file(speech_file, index):
    client = speech.SpeechClient()

    with io.open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=48000,
        language_code="en-US",
    ) 
    
    start = time.time()
    response = client.recognize(config=config, audio=audio)
    end = time.time()
    print("elapsed time: " + str(end-start) + " seconds for thread " + str(index))
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        print(u"Transcript: {}".format(result.alternatives[0].transcript))
        
        
threads = []
for i in range(100):
    t = threading.Thread(target=transcribe_file, args=('uploads/input.flac', i))
    t.start()
    threads.append(t)
        
for t in threads:
    t.join()


