
// export default App;
import { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bgPosition, setBgPosition] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://ai-image-detector-backend4.onrender.com/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgPosition((prev) => (prev + 0.3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#E0E0E0",
        background: `linear-gradient(${bgPosition}deg, #0f1115, #1a1c22, #22232c)`,
        transition: "background 0.3s linear",
      }}
    >
      <div
        style={{
          maxWidth: "550px",
          width: "100%",
          backgroundColor: "rgba(30,30,30,0.85)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#fff" }}>
          RitweekAI Detector
        </h1>
        <p style={{ marginBottom: "30px", color: "#bbb" }}>
          Advanced AI-powered image analysis
        </p>

        {/* DROP ZONE */}
        <div
          onClick={() => document.getElementById("fileInput").click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px solid #0af" : "2px dashed #444",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "20px",
            cursor: "pointer",
            backgroundColor: dragActive
              ? "rgba(60,60,60,0.8)"
              : "rgba(40,40,40,0.6)",
            transition: "0.3s",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", borderRadius: "15px" }}
            />
          ) : (
            <p style={{ color: "#888" }}>
              Drag & drop an image or click to upload
            </p>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "15px",
            border: "none",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#fff",
            background: loading
              ? "linear-gradient(135deg, #444, #222)"
              : "linear-gradient(135deg, #333, #111)",
          }}
        >
          {loading ? "Analyzing..." : "Detect"}
        </button>

        {result && (
          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              borderRadius: "20px",
              backgroundColor: "rgba(40,40,40,0.85)",
              textAlign: "left",
            }}
          >
            <h2 style={{ marginBottom: "15px", color: "#fff" }}>Result</h2>
            <p>
              <b>Prediction:</b> {result.prediction}
            </p>

            <div style={{ marginTop: "10px" }}>
              <b>Confidence:</b>
              <div
                style={{
                  height: "15px",
                  backgroundColor: "#444",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${result.confidence}%`,
                    background: "linear-gradient(90deg, #0f0, #0af)",
                    borderRadius: "10px",
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <span style={{ color: "#aaa" }}>{result.confidence}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
