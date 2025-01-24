"use client";
import React, { useState, useEffect } from "react";

export const FileContent = ({ className, fileData, renderTable }) => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
    console.log(fileData,"file content")
  useEffect(() => {
    // Adjust the activeTab if the current active file is removed
    if (fileData.length === 0) {
      setActiveTab(0); // Reset to 0 if no files exist
    } else if (activeTab >= fileData.length) {
      setActiveTab(fileData.length - 1); // Adjust activeTab to the last valid file
    }
  }, [fileData, activeTab]);

  if (fileData.length === 0) {
    return (
      <div className={className}>
        <p className="italic text-sm">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {/* Render tabs for each file */}
          {fileData.map((file, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-2 px-4 border rounded-t-lg ${
                activeTab === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {file.fileName}
            </button>
          ))}
        </div>

        <div className="max-h-[400px] overflow-y-auto border border-gray-300 p-4 rounded-lg">
          {/* Show the content of the active tab only if it exists */}
          {fileData[activeTab] && (
            <>
              <h4 className="font-bold mb-2">{fileData[activeTab].fileName}</h4>
              {renderTable(fileData[activeTab].content || [])}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
