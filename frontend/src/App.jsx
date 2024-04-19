import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import "./App.css";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [prompt, setPrompt] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const summaryRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = getVideoIdFromUrl(videoUrl);
    if (!id) {
      setError("Invalid YouTube URL");
      return;
    }
    setVideoId(id);
    setFormSubmitted(true);
  };

  const getVideoIdFromUrl = (url) => {
    const regex = /[?&]v=([^&]+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!videoId) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/fetchTranscript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        if (!response.ok) throw new Error("Failed to fetch transcript");
        const data = await response.json();
        setTranscript(data.items[0].snippet.description);
      } catch (err) {
        setError(err.message || "Error fetching transcript");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [videoId]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (transcript && formSubmitted) {
        setLoading(true);
        setError("");
        try {
          const response = await fetch("/fetchSummary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript, prompt }),
          });
          if (!response.ok) throw new Error("Failed to fetch summary");
          const data = await response.json();
          setSummary(data);
          summaryRef.current.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
          setError(err.message || "Error fetching summary");
        } finally {
          setLoading(false);
          setFormSubmitted(false);
        }
      }
    };

    fetchSummary();
  }, [transcript, formSubmitted, prompt]);

  return (
    <div className="app">
      <h1 style={{ color: "red" }}>YouTube Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <VideoInput videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
        <PromptInput prompt={prompt} setPrompt={setPrompt} />
        <SubmitButton loading={loading} />
      </form>

      <LoadingMessage loading={loading} />
      <ErrorMessage error={error} />
      <YouTubePlayer videoId={videoId} />
      <Summary
        transcriptLoaded={!!transcript}
        summary={summary}
        ref={summaryRef}
      />
    </div>
  );
}

const VideoInput = ({ videoUrl, setVideoUrl }) => (
  <input
    type="text"
    placeholder="YouTube Video URL"
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
    {loading ? "Loading..." : "Submit"}
  </button>
);

const LoadingMessage = ({ loading }) => loading && <p>Loading...</p>;

const ErrorMessage = ({ error }) => error && <p>{error}</p>;

const YouTubePlayer = ({ videoId }) => videoId && <YouTube videoId={videoId} />;

export default App;
const Summary = React.forwardRef(
  ({ transcriptLoaded, summary }, ref) =>
    transcriptLoaded && (
      <div className="summary" ref={ref}>
        <p>{summary}</p>
      </div>
    )
);
