import { useState, useRef, useCallback, useEffect } from 'react';
import { Groq } from 'groq-sdk';

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [volume, setVolume] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const isIntentRecordingRef = useRef(false);

  // Load devices on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices(all.filter(d => d.kind === 'audioinput'));
      } catch (e) { console.error("Device fetch error:", e); }
    };
    fetchDevices();
  }, []);

  const stopRecording = useCallback(() => {
    console.log("Recorder: Engagement STOPPED.");
    isIntentRecordingRef.current = false;
    
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }

    setIsRecording(false);
    setVolume(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("Recorder: Starting LIVELY capture sequence...");
      setTranscript('');
      latestTranscriptRef.current = '';
      setError(null);
      setAudioUrl(null);
      setVolume(0);
      audioChunksRef.current = [];
      isIntentRecordingRef.current = true;
      setIsInitializing(true);

      const constraints = { 
        audio: { 
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // 1. NATIVE SPEECH ENGINE (For Lively Printing)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        // NON-CONTINUOUS IS KEY: It fires 'onresult' much faster on many browsers
        recognition.continuous = false; 
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => { console.log("SpeechRecognition: Engine engaged."); };

        recognition.onresult = (event) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
              const segment = result[0].transcript.trim();
              // Filter Whisper-style hallucinations even in native if they occur
              const bad = ['thank you', 'thanks', 'watching', 'bye'];
              if (segment && !bad.includes(segment.toLowerCase().replace(/[^\w\s]/g, ''))) {
                latestTranscriptRef.current += segment + ' ';
              }
            } else {
              interimText += result[0].transcript;
            }
          }
          // FORCE UI UPDATE
          const combined = (latestTranscriptRef.current + interimText).trim();
          setTranscript(combined);
          console.log("SpeechRecognition Lively Update:", combined);
        };

        recognition.onend = () => {
          // Restart immediately to simulate continuous but with faster result firing
          if (isIntentRecordingRef.current && recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      // 2. VOLUME ANALYSIS (For visual feedback)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      if (audioContext.state === 'suspended') await audioContext.resume();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!isIntentRecordingRef.current || !analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setVolume(sum / dataArray.length);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // 3. MEDIA RECORDER (For Cloud Fallback)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioUrl(URL.createObjectURL(blob));

        // FALLBACK: If Native engine was silent, trigger Whisper
        if (!latestTranscriptRef.current.trim() && audioChunksRef.current.length > 0) {
          setIsTranscribing(true);
          try {
            const file = new File([blob], `audio.${mimeType.split('/')[1]}`, { type: mimeType });
            const transcription = await groq.audio.transcriptions.create({
              file: file,
              model: "whisper-large-v3-turbo",
              language: "en",
            });
            const text = transcription.text.trim();
            const hallucinations = ['thank you', 'thanks', 'watching', 'bye'];
            if (text && !hallucinations.includes(text.toLowerCase().replace(/[^\w\s]/g, ''))) {
               setTranscript(text);
            }
          } catch (err) { console.error("Cloud Fallback Error:", err); }
          finally { setIsTranscribing(false); }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsInitializing(false);

    } catch (err) {
      console.error("Mic Setup Error:", err);
      setError("Microphone access failed.");
      setIsInitializing(false);
      setIsRecording(false);
    }
  }, [selectedDeviceId]);

  return {
    isRecording, isInitializing, transcript, error, audioUrl, volume,
    isTranscribing, devices, selectedDeviceId, setSelectedDeviceId,
    startRecording, stopRecording, setTranscript
  };
};
