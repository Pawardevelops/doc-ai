"use client";
import { useState } from "react";
import { read, utils } from "xlsx";
import ReactMarkdown from "react-markdown";
import { FileUpload } from "./components/ui/file-upload";
import { FlipWords } from "./components/ui/flip-words";

export default function Home() {
  const [fileData, setFileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page for pagination
  const [userQuery, setUserQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");

  const recordsPerPage = 10; // Set the number of records per page

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
          const lines = event.target.result.split("\n");
          const headers = lines[0].split(","); // Assume the first line is the header
          parsedData = lines.slice(1).map((line) => {
            const values = line.split(",");
            return headers.reduce((acc, header, index) => {
              acc[header] = values[index];
              return acc;
            }, {});
          });
        } else {
          setError("Unsupported file format. Only .csv and .xlsx are allowed.");
          return;
        }

        newFileData.push({ fileName: file.name, content: parsedData });

        // If all files are processed, update state
        if (newFileData.length === newFiles.length) {
          setFileData((prevData) => [...prevData, ...newFileData]);
          setChat([]); // Clear chat when new files are uploaded
          setCurrentPage(1); // Reset to the first page
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

  const renderTable = (data) => {
    if (data.length === 0) return <p>No data available</p>;

    // Pagination logic
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const headers = Object.keys(data[0]); // Extract headers from the first record

    return (
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f4f4f4",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{ border: "1px solid #ddd", padding: "8px" }}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              padding: "5px 10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(data.length / recordsPerPage)}
          </span>
          <button
            disabled={currentPage === Math.ceil(data.length / recordsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              padding: "5px 10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor:
                currentPage === Math.ceil(data.length / recordsPerPage)
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div
      style={{
        textAlign: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "20px",
          wordWrap: "break-word",
          color: "#007ACC",
      }}
      >
        Chat With<FlipWords words={["XLSX","CSV"]} />
      </div>
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
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          {fileData.map((file, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <h4 style={{ margin: "5px 0" }}>{file.fileName}</h4>
              {renderTable(file.content)}
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
