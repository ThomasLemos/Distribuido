import sounddevice as sd
import soundfile as sf
import librosa

# Set the sample rate
sr = 44100

# Set the recording duration
duration = 5  # Recording duration in seconds

# Record audio from the microphone
print("gravando")
y = sd.rec(int(duration * sr), samplerate=sr, channels=1)
sd.wait()  # Wait for the recording to finish
print("acabou")

# Save the recorded audio to a file
output_file = "recorded_audio.wav"
sf.write(output_file, y, sr)

# mudando o pit
# Load the original audio file
audio_file = "recorded_audio.wav"
y, sr = librosa.load(audio_file)

# Shift the pitch up by 5 semitones
y_shifted = librosa.effects.pitch_shift(y, sr, n_steps=5)

# Save the shifted audio to a file
output_file = "shifted_audio.wav"
sf.write(output_file, y_shifted, sr)
#tenta
