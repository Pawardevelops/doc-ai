"use client";
import { useState } from "react";
import { read, utils } from "xlsx";
import ReactMarkdown from "react-markdown";
import { FileUpload } from "./components/ui/file-upload";

export default function Home() {
  const [fileData, setFileData] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (newFiles) => {
    const newFileData = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        let parsedData;

        if (file.name.endsWith(".xlsx")) {
          // Parse XLSX file
          const workbook = read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = utils.sheet_to_json(worksheet); // Convert worksheet to JSON
        } else if (file.name.endsWith(".csv")) {
          // Parse CSV file
          parsedData = event.target.result
            .split("\n")
            .map((line) => line.split(",")); // Split CSV lines
        } else {
          setError("Unsupported file format. Only .csv and .xlsx are allowed.");
          return;
        }

        newFileData.push({ fileName: file.name, content: parsedData });

        // If all files are processed, update state
        if (newFileData.length === newFiles.length) {
          setFileData((prevData) => [...prevData, ...newFileData]);
          setChat([]); // Clear chat when new files are uploaded
        }
      };

      if (file.name.endsWith(".xlsx")) {
        reader.readAsBinaryString(file);
      } else if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (fileData.length === 0) {
      setError("Please upload at least one file first.");
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery,
          fileData: fileData.map((file) => ({
            fileName: file.fileName,
            content: file.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch response.");
      }
      const data = await response.json();

      setChat((prevChat) => [
        ...prevChat,
        { type: "user", message: userQuery },
        { type: "ai", message: data.response },
      ]);

      setUserQuery(""); // Clear the input
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Chat with Data Files</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <FileUpload onChange={(files) => handleFileChange(files)} />
        <p style={{ fontStyle: "italic", fontSize: "14px" }}>
          {fileData.length > 0
            ? `${fileData.length} file(s) uploaded successfully.`
            : "No files uploaded yet."}
        </p>

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          {fileData.map((file, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <h4 style={{ margin: "5px 0" }}>{file.fileName}</h4>
              <pre
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  borderRadius: "4px",
                  overflowX: "auto",
                }}
              >
                {Array.isArray(file.content)
                  ? file.content
                      .map((row) =>
                        Array.isArray(row)
                          ? row.join(", ")
                          : Object.values(row).join(", ")
                      )
                      .join("\n")
                  : JSON.stringify(file.content, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          maxHeight: "300px",
          overflowY: "auto",
          marginBottom: "20px",
        }}
      >
        {chat.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: message.type === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: message.type === "user" ? "#4CAF50" : "#ddd",
                color: message.type === "user" ? "white" : "black",
              }}
            >
              {message.type === "ai" ? (
                <ReactMarkdown>{message.message}</ReactMarkdown>
              ) : (
                <p>{message.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask a question about the files"
          style={{
            width: "calc(100% - 110px)",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
