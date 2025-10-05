"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RightPanel from "./RightPanel";

// --- Type for AI Plant Detector ---
type PlantResult = {
  name: string;
  growth: string;
  water: string;
  light: string;
  habitat: string;
};

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Layout Styles ---
  const appContainerStyle: React.CSSProperties = {
    width: "100vw",
    minHeight: "100vh",
    background: "#fefaf5",
    boxSizing: "border-box",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flex: 1,
    minHeight: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 163px)",
    paddingTop: isMobile ? "120px" : "163px",
  };

  return (
    <div style={appContainerStyle}>
      <Navbar />
      <div style={contentStyle}>
        <Sidebar />
        <MainContent />
        <RightPanel />
      </div>
    </div>
  );
}

// --- MAIN CONTENT: AI Plant Detector ---
function MainContent() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectBtnHover, setDetectBtnHover] = useState(false);

  // --- Styles ---
  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: "48px 32px 32px 32px",
    background: "#fdf6ed",
    minHeight: "calc(100vh - 48px)",
  };

  const breadcrumbStyle: React.CSSProperties = {
    fontSize: "0.95rem",
    color: "#6c8a72",
    marginBottom: "18px",
  };

  const h1Style: React.CSSProperties = {
    color: "#2f4f2f",
    marginTop: 0,
    fontSize: "2rem",
  };

  const pStyle: React.CSSProperties = {
    color: "#4a4a4a",
    fontSize: "14px",
  };

  const uploadBoxStyle: React.CSSProperties = {
    border: "2px dashed #b3b3b3",
    borderRadius: "12px",
    padding: "36px",
    textAlign: "center",
    margin: "12px 0",
    background: "#fff",
    color: "#6c8a72",
    fontSize: "1.1rem",
  };

  const detectBtnContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    margin: "16px 0",
  };

  const detectBtnStyle: React.CSSProperties = {
    background: detectBtnHover ? "#b3d1b0" : "#cde3d0",
    border: "none",
    padding: "12px 32px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "1.1rem",
    color: "#2f4f2f",
    transition: "background 0.2s",
  };

  const resultContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4px",
  };

  const resultStyle: React.CSSProperties = {
    display: "inline-flex",
    border: "1px solid #f3c77c",
    borderRadius: "12px",
    padding: "32px",
    gap: "40px",
    background: "#fff",
    alignItems: "center",
  };

  const resultInfoH2Style: React.CSSProperties = {
    margin: "0 0 8px 0",
    color: "#2f4f2f",
    fontSize: "2rem",
  };

  const resultInfoDivStyle: React.CSSProperties = {
    color: "#4a4a4a",
    fontSize: "1.3rem",
    marginBottom: "4px",
  };

  const previewImgStyle: React.CSSProperties = {
    maxWidth: "240px",
    maxHeight: "240px",
    borderRadius: "8px",
  };

  // --- Logic: Upload + Detection ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data: { plant: PlantResult } = await res.json();
      if (data.plant) setResult(data.plant);
      else setError("No plant data returned.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        } else {
          setError("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
    }
   };

  return (
    <main style={mainStyle}>
      <div style={breadcrumbStyle}>
        Home &gt; Garden Tools &gt; AI Plant Detector
      </div>

      <h1 style={h1Style}>Identify plants with AI</h1>
      <p style={pStyle}>
        Upload a photo and let us recognize and share plant details in seconds
      </p>

      {/* Upload Box */}
      <div style={uploadBoxStyle}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
        />
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={240}
              height={240}
              style={previewImgStyle}
            />
          ) : (
            <>
              <span>
                Click to upload <br /> or drag and drop
              </span>
              <div>JPG, JPEG, PNG less than 1MB</div>
            </>
          )}
        </label>
      </div>

      {/* Detect Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "180px",
          justifyContent: "center",
        }}
      >
        <div style={detectBtnContainerStyle}>
          <button
            style={detectBtnStyle}
            onClick={handleDetect}
            disabled={!file || loading}
            onMouseEnter={() => setDetectBtnHover(true)}
            onMouseLeave={() => setDetectBtnHover(false)}
          >
            {loading ? "Detecting..." : "Detect"}
          </button>
        </div>

        {error && <div style={{ color: "red", marginTop: "12px" }}>{error}</div>}
      </div>

      {/* Results */}
      {result && (
        <div>
          <div
            style={{
              color: "green",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            Analyzing completed ✅
          </div>
          <div style={resultContainerStyle}>
            <div style={resultStyle}>
              <Image
                src={preview || "/unknown.png"}
                alt={result.name || "Unknown plant"}
                width={240}
                height={240}
                style={previewImgStyle}
              />
              <div>
                <h2 style={resultInfoH2Style}>
                  {result.name || "Unknown Plant"}
                </h2>
                <div style={resultInfoDivStyle}>
                  Growth: {result.growth || "N/A"}
                </div>
                <div style={resultInfoDivStyle}>
                  Water: {result.water || "N/A"}
                </div>
                <div style={resultInfoDivStyle}>
                  Light: {result.light || "N/A"}
                </div>
                <div style={resultInfoDivStyle}>
                  Habitat: {result.habitat || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
