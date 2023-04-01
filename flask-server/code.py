import librosa
import sounddevice as sd
import scipy.io.wavfile as wav

def record_audio(filename, duration=5):
    # Set parameters for the audio stream
    duration = 5  # Duration of recording
    fs = 44100  # Sampling rate
    # Start recording
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()  # wait until recording is finished
    # Save the original recording to a WAV file
    wav.write(filename, fs, recording)
