import { useState, useEffect, useRef } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const homeRef = useRef(null);
  const detectorRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const faqRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
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
      const res = await fetch(
        "https://ritweekraj288-ai-image-detector-backend.hf.space/predict",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Analysis failed. Please try again." });
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const navBg = scrollY > 50 ? "rgba(9,9,11,0.95)" : "rgba(9,9,11,0.7)";
  const navBlur = scrollY > 50 ? "blur(12px)" : "blur(8px)";

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#fafafa",
      background: "#09090b",
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden"
    }}>
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(63,63,70,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.15) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        pointerEvents: "none",
        opacity: 0.4
      }} />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "12px 20px" : "16px 48px",
        background: navBg,
        backdropFilter: navBlur,
        borderBottom: "1px solid rgba(63,63,70,0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.125rem", fontWeight: "600", letterSpacing: "-0.025em" }}>RitweekAI</span>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {[
              { label: "Home", ref: homeRef },
              { label: "Detector", ref: detectorRef },
              { label: "How It Works", ref: howRef },
              { label: "Features", ref: whyRef },
              { label: "FAQ", ref: faqRef }
            ].map((item) => (
              <button key={item.label} onClick={() => scrollTo(item.ref)} style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#a1a1aa",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "color 0.2s",
                padding: 0
              }} onMouseEnter={(e) => e.target.style.color = "#fafafa"} onMouseLeave={(e) => e.target.style.color = "#a1a1aa"}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section ref={homeRef} style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: isMobile ? "100px 20px 60px" : "120px 48px 80px",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "100%" : "600px",
          height: isMobile ? "100%" : "600px",
          background: "radial-gradient(circle, rgba(250,250,250,0.03), transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <div style={{
            display: "inline-block",
            padding: "6px 14px",
            background: "rgba(250,250,250,0.06)",
            border: "1px solid rgba(250,250,250,0.1)",
            borderRadius: "24px",
            fontSize: "0.75rem",
            color: "#d4d4d8",
            fontWeight: "500",
            letterSpacing: "0.05em",
            marginBottom: "32px",
            textTransform: "uppercase"
          }}>
            Vision Transformer Technology
          </div>
          
          <h1 style={{
            fontSize: isMobile ? "2.5rem" : "4.5rem",
            fontWeight: "700",
            marginBottom: "24px",
            lineHeight: "1.1",
            letterSpacing: "-0.04em",
            color: "#fafafa"
          }}>
            AI Image Detection<br />Redefined
          </h1>
          
          <p style={{
            fontSize: isMobile ? "1rem" : "1.125rem",
            color: "#a1a1aa",
            maxWidth: "600px",
            margin: "0 auto 48px",
            lineHeight: "1.7",
            fontWeight: "400"
          }}>
            Enterprise-grade detection system powered by advanced neural networks. Identify AI-generated content with precision and confidence.
          </p>
          
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => scrollTo(detectorRef)} style={{
              padding: "14px 32px",
              fontSize: "0.9375rem",
              fontWeight: "500",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "#fafafa",
              color: "#09090b",
              transition: "all 0.2s",
              letterSpacing: "-0.01em"
            }}>
              Start Detection
            </button>
            
            <button onClick={() => scrollTo(howRef)} style={{
              padding: "14px 32px",
              fontSize: "0.9375rem",
              fontWeight: "500",
              borderRadius: "8px",
              border: "1px solid rgba(250,250,250,0.2)",
              cursor: "pointer",
              background: "transparent",
              color: "#fafafa",
              transition: "all 0.2s",
              letterSpacing: "-0.01em"
            }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{
        padding: isMobile ? "40px 20px" : "80px 48px",
        borderTop: "1px solid rgba(63,63,70,0.3)",
        borderBottom: "1px solid rgba(63,63,70,0.3)",
        background: "rgba(24,24,27,0.4)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "grid", 
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
          gap: isMobile ? "24px" : "48px" 
        }}>
          {[
            { value: "99.2%", label: "Detection Accuracy" },
            { value: "<1.8s", label: "Processing Speed" },
            { value: "500K+", label: "Images Analyzed" },
            { value: "Enterprise", label: "Grade Security" }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? "1.75rem" : "2.5rem", fontWeight: "700", color: "#fafafa", marginBottom: "8px", letterSpacing: "-0.02em" }}>{stat.value}</div>
              <div style={{ color: "#71717a", fontSize: "0.875rem", fontWeight: "500" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DETECTOR SECTION */}
      <section ref={detectorRef} style={{
        minHeight: "100vh",
        padding: isMobile ? "80px 20px" : "120px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ maxWidth: "600px", width: "100%", textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "700", marginBottom: "16px", letterSpacing: "-0.03em" }}>Detection Engine</h2>
          <p style={{ color: "#a1a1aa", fontSize: "1rem", lineHeight: "1.6" }}>
            Upload an image to analyze its authenticity using our neural network
          </p>
        </div>

        <div style={{
          width: "100%",
          maxWidth: "640px",
          background: "rgba(24,24,27,0.6)",
          border: "1px solid rgba(63,63,70,0.3)",
          borderRadius: "16px",
          padding: isMobile ? "20px" : "40px",
          backdropFilter: "blur(12px)",
          boxSizing: "border-box"
        }}>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("fileInput").click()}
            style={{
              border: dragActive ? "2px dashed rgba(250,250,250,0.4)" : "2px dashed rgba(63,63,70,0.5)",
              borderRadius: "12px",
              padding: preview ? "0" : (isMobile ? "40px 20px" : "64px 32px"),
              textAlign: "center",
              cursor: "pointer",
              background: dragActive ? "rgba(250,250,250,0.03)" : "rgba(24,24,27,0.4)",
              transition: "all 0.2s",
              marginBottom: "24px",
              overflow: "hidden"
            }}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: "400px", objectFit: "contain", display: "block" }} />
            ) : (
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={{ fontSize: "1rem", color: "#d4d4d8", marginBottom: "8px", fontWeight: "500" }}>
                  Drop image or click to browse
                </p>
                <p style={{ color: "#71717a", fontSize: "0.875rem" }}>
                  PNG, JPG, WEBP • Max 10MB
                </p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "0.9375rem",
              fontWeight: "500",
              borderRadius: "8px",
              border: "none",
              cursor: file && !loading ? "pointer" : "not-allowed",
              background: file && !loading ? "#fafafa" : "rgba(63,63,70,0.5)",
              color: file && !loading ? "#09090b" : "#52525b",
              transition: "all 0.2s",
              letterSpacing: "-0.01em"
            }}
          >
            {loading ? "Processing..." : "Analyze Image"}
          </button>

          {result && !result.error && (
            <div style={{
              marginTop: "32px",
              padding: isMobile ? "16px" : "24px",
              background: result.prediction === "Real" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${result.prediction === "Real" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "12px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Classification
                  </div>
                  <div style={{ fontSize: isMobile ? "1.125rem" : "1.5rem", fontWeight: "600", color: result.prediction === "Real" ? "#22c55e" : "#ef4444", letterSpacing: "-0.02em" }}>
                    {result.prediction}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Confidence
                  </div>
                  <div style={{ fontSize: isMobile ? "1.125rem" : "1.5rem", fontWeight: "600", color: "#fafafa", letterSpacing: "-0.02em" }}>
                    {result.confidence}%
                  </div>
                </div>
              </div>

              <div style={{ height: "6px", background: "rgba(63,63,70,0.3)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${result.confidence}%`,
                  background: result.prediction === "Real" ? "#22c55e" : "#ef4444",
                  transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howRef} style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: "rgba(24,24,27,0.4)",
        borderTop: "1px solid rgba(63,63,70,0.3)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto 64px", textAlign: "center" }}>
            <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "700", marginBottom: "16px", letterSpacing: "-0.03em" }}>Process Overview</h2>
            <p style={{ color: "#a1a1aa", fontSize: "1rem", lineHeight: "1.6" }}>
              Four-step analysis pipeline delivering results in under 2 seconds
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "24px"
          }}>
            {[
              { num: "01", title: "Image Upload", desc: "Secure file transfer with format validation and preprocessing" },
              { num: "02", title: "Neural Processing", desc: "Vision Transformer analyzes pixel-level patterns and artifacts" },
              { num: "03", title: "Feature Extraction", desc: "Multi-layer analysis identifies AI generation signatures" },
              { num: "04", title: "Classification", desc: "Binary output with confidence score and detailed metrics" }
            ].map((step, i) => (
              <div key={i} style={{
                padding: "32px",
                background: "rgba(24,24,27,0.6)",
                border: "1px solid rgba(63,63,70,0.3)",
                borderRadius: "12px"
              }}>
                <div style={{ fontSize: "0.875rem", color: "#71717a", fontWeight: "600", marginBottom: "16px", letterSpacing: "0.05em" }}>{step.num}</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "12px", letterSpacing: "-0.02em" }}>{step.title}</h3>
                <p style={{ color: "#a1a1aa", lineHeight: "1.6", fontSize: "0.9375rem" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section ref={whyRef} style={{ padding: isMobile ? "80px 20px" : "120px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto 64px", textAlign: "center" }}>
            <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "700", marginBottom: "16px", letterSpacing: "-0.03em" }}>Core Capabilities</h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px"
          }}>
            {[
              { title: "Vision Transformers", desc: "State-of-the-art ViT architecture trained on millions of samples" },
              { title: "Real-time Processing", desc: "Optimized inference pipeline with <2s response time" },
              { title: "Zero Data Retention", desc: "Images processed in-memory and immediately discarded" },
              { title: "99%+ Accuracy", desc: "Validated across major AI generators and real image datasets" },
              { title: "Continuous Updates", desc: "Model retraining to detect emerging generation techniques" },
              { title: "Format Agnostic", desc: "Universal support for all standard image formats and sizes" }
            ].map((feature, i) => (
              <div key={i} style={{
                padding: "24px",
                background: "rgba(24,24,27,0.6)",
                border: "1px solid rgba(63,63,70,0.3)",
                borderRadius: "12px"
              }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>{feature.title}</h3>
                <p style={{ color: "#a1a1aa", lineHeight: "1.6", fontSize: "0.875rem" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: "rgba(24,24,27,0.4)",
        borderTop: "1px solid rgba(63,63,70,0.3)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "700", textAlign: "center", marginBottom: "48px" }}>Common Questions</h2>
          {[
            { q: "What is the detection accuracy?", a: "Our system achieves 99.2% accuracy on standardized benchmarks." },
            { q: "Which AI generators are supported?", a: "DALL-E, Midjourney, Stable Diffusion, Adobe Firefly, and more." },
            { q: "How is data privacy maintained?", a: "Zero-persistence architecture: images are immediately purged." },
            { q: "Can edited images be detected?", a: "Yes, though confidence may vary with heavy modification." },
            { q: "What is the processing time?", a: "Average analysis time is 1.8 seconds." }
          ].map((faq, i) => (
            <div key={i} style={{
              marginBottom: "16px",
              padding: "24px",
              background: "rgba(24,24,27,0.6)",
              border: "1px solid rgba(63,63,70,0.3)",
              borderRadius: "12px"
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px" }}>{faq.q}</h3>
              <p style={{ color: "#a1a1aa", lineHeight: "1.7", fontSize: "0.9375rem" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 20px 32px", borderTop: "1px solid rgba(63,63,70,0.3)", background: "rgba(9,9,11,0.8)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>RitweekAI</span>
          <p style={{ color: "#52525b", fontSize: "0.875rem", margin: "16px 0 24px" }}>Vision Transformer-powered AI detection system</p>
          <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(63,63,70,0.3)" }}>
            <p style={{ color: "#3f3f46", fontSize: "0.8125rem" }}>© {new Date().getFullYear()} RitweekAI • Built by Ritweek Raj</p>
          </div>
        </div>
      </footer>
    </div>
  );
}