import React, { useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const SpeechToText = ({ onTranscriptChange }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => {
            const newTranscript = prev + transcriptSegment;
            try {
              if (typeof onTranscriptChange === "function") {
                onTranscriptChange(newTranscript);
              }
            } catch (error) {
              console.error("Error updating transcript:", error);
            }
            return newTranscript;
          });
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [listening, onTranscriptChange]);

  const toggleListening = () => {
    setListening((prevState) => !prevState);
  };

  return (
    <button
      onClick={toggleListening}
      className="bg-zinc-700 text-xl p-2 hover:invert"
    >
      {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
    </button>
  );
};

export default SpeechToText;
