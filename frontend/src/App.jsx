import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import "./App.css";

const VideoInput = ({ videoUrl, setVideoUrl }) => (
  <input
    type="text"
    placeholder="Enter YouTube video URL"
    value={videoUrl}
    onChange={(e) => setVideoUrl(e.target.value)}
  />
);

const PromptInput = ({ prompt, setPrompt }) => (
  <input
    type="text"
    placeholder="Enter your summarization prompt"
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
  />
);

const SubmitButton = ({ loading }) => (
  <button type="submit" disabled={loading}>
    Submit
  </button>
);

const LoadingMessage = ({ loading }) => loading && <p>Loading...</p>;

const ErrorMessage = ({ error }) => error && <p>{error}</p>;

const YouTubePlayer = ({ videoId }) => <YouTube videoId={videoId} />;

const Summary = React.forwardRef(
  ({ transcriptLoaded, summary }, ref) =>
    transcriptLoaded && (
      <div className="summary" ref={ref}>
        <p>{summary}</p>
      </div>
    )
);
function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptLoaded, setTranscriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [prompt, setPrompt] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    const videoIdFromUrl = new URLSearchParams(new URL(videoUrl).search).get(
      "v"
    );
    if (videoIdFromUrl) {
      setVideoId(videoIdFromUrl);
    }
  }, [videoUrl]);

  // fetchTranscript and fetchSummary effects remain unchanged

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="app">
      <h1>YouTube Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <VideoInput videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
        <PromptInput prompt={prompt} setPrompt={setPrompt} />
        <SubmitButton loading={loading} />
      </form>

      <LoadingMessage loading={loading} />
      <ErrorMessage error={error} />
      <YouTubePlayer videoId={videoId} />
      <Summary
        transcriptLoaded={transcriptLoaded}
        summary={summary}
        ref={summaryRef}
      />
    </div>
  );
}

export default App;
