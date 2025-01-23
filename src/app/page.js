"use client";
import { useState } from "react";
import { read, utils } from "xlsx";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [fileData, setFileData] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFileData = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        let parsedData;
        if (file.name.endsWith(".xlsx")) {
          const workbook = read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = utils.sheet_to_json(worksheet);
        } else {
          parsedData = event.target.result
            .split("\n")
            .map((line) => line.split(",")); 
        }

        newFileData.push({ fileName: file.name, content: parsedData });

        if (newFileData.length === files.length) {
          setFileData(newFileData);
          setChat([]); 
        }
      };

      if (file.name.endsWith(".xlsx")) {
        reader.readAsBinaryString(file);
      } else {
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

      setUserQuery(""); 
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
        <label style={{ display: "block", marginBottom: "5px" }}>
          Upload Files:
        </label>
        <input
          type="file"
          accept=".csv, .xlsx"
          multiple
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
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
                      .map(
                        (row) =>
                          Array.isArray(row) // Check if the row is an array
                            ? row.join(", ") // Join array elements with a comma
                            : Object.values(row).join(", ") // Convert object values to a string
                      )
                      .join("\n") // Join rows with a newline
                  : JSON.stringify(file.content, null, 2)}{" "}
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
