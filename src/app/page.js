"use client";

import { useState } from "react";
import { read, utils } from "xlsx";
import { FileUpload } from "./components/ui/file-upload";
import { FlipWords } from "./components/ui/flip-words";
import { PlaceholdersAndVanishInput } from "./components/ui/placeholders-and-vanish-input";
import { FileContent } from "./components/ui/file-content";
import { ChatSection } from "./components/ui/chat-section";

export default function Home() {
  const [fileData, setFileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userQuery, setUserQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recordsPerPage = 10;

  const handleFileChange = (newFiles) => {
    console.log(newFiles);
    if (newFiles.length == 0) {
      setFileData([]);
    }
    const newFileData = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        let parsedData;

        if (file.name.endsWith(".xlsx")) {
          const workbook = read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          parsedData = utils.sheet_to_json(worksheet);
        } else if (file.name.endsWith(".csv")) {
          const lines = event.target.result.split("\n");
          const headers = lines[0].split(",");
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

        if (newFileData.length === newFiles.length) {
          setFileData((prevData) => [...newFileData]);
          setChat([]);
          setCurrentPage(1);
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

    if (!userQuery.trim()) return;
    if (fileData.length === 0) {
      setError("Please upload at least one file first.");
      return;
    }

    const userMessage = { type: "user", message: userQuery };
    setChat((prevChat) => [...prevChat, userMessage]);
    setUserQuery("");
    setLoading(true);

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
        { type: "ai", message: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data) => {
    if (data.length === 0) return <p>No data available</p>;

    const headers = Object.keys(data[0]);

    return (
      <div>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 text-left font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 p-2">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 font-sans">
      <div className="text-center text-3xl font-bold text-blue-600 mb-6">
        Chat With <FlipWords words={["XLSX", "CSV"]} />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="">
        {/* Left Section */}
        <div className="">
          <FileUpload onChange={(files) => handleFileChange(files)} />
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Content Section */}
          <div className="border border-gray-300 rounded-lg p-4">
            <FileContent
              className="flex-6"
              fileData={fileData}
              renderTable={renderTable}
              recordsPerPage={10}
            />
          </div>

          {/* Chat Section */}
          <div className="border border-gray-300 rounded-lg p-4">
            <ChatSection
              className="flex-6"
              chat={chat}
              loading={loading}
              setUserQuery={setUserQuery}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
