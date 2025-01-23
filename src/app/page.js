"use client";
import { useState } from "react";
import { read, utils } from "xlsx"; // Correctly import `read` and `utils`
import ReactMarkdown from "react-markdown"; // Import react-markdown

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [response, setResponse] = useState("");
  const [csvData, setCsvData] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQuery, csvData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch response.");
      }
      const data = await response.json();
      setResponse(data.response); // Save the raw Markdown response
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (file.name.endsWith(".xlsx")) {
          const workbook = read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);
          setCsvData(JSON.stringify(jsonData));
        } else {
          setCsvData(event.target.result);
        }
      };
      if (file.name.endsWith(".xlsx")) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Chat with Data Files</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>File Data (or select file):</label>
          <textarea
            style={{ width: "100%", padding: "8px", borderColor: "gray", borderRadius: "4px" }}
            rows="4"
            placeholder="Enter CSV data as a string"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
          />
          <input
            type="file"
            accept=".csv, .xlsx, .pdf, .docx"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Your Question:</label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px", borderColor: "gray", borderRadius: "4px" }}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask a question about the file"
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
        >
          Send Question
        </button>
      </form>
      {response && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
          <p>
            <strong>Gemini Response:</strong>
          </p>
          {/* Use ReactMarkdown to render the response */}
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
