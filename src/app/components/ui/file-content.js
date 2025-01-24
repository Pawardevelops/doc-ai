"use client";
import React, { useState, useEffect } from "react";

export const FileContent = ({ className, fileData, renderTable, recordsPerPage }) => {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  useEffect(() => {
    // Adjust the activeTab if the current active file is removed
    if (fileData.length === 0) {
      setActiveTab(0); // Reset to 0 if no files exist
    } else if (activeTab >= fileData.length) {
      setActiveTab(fileData.length - 1); // Adjust activeTab to the last valid file
    }

    // Reset currentPage when switching tabs
    setCurrentPage(1);
  }, [fileData, activeTab]);

  if (fileData.length === 0) {
    return (
      <div className={className}>
        <p className="italic text-sm">No files uploaded yet.</p>
      </div>
    );
  }

  // Calculate paginated data for the current tab
  const currentTabData = fileData[activeTab]?.content || [];
  const totalPages = Math.ceil(currentTabData.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        {/* Tabs for file selection */}
        <div className="flex gap-2 overflow-x-auto">
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

        {/* Table rendering */}
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 p-4 rounded-lg">
          {fileData[activeTab] && (
            <>
              <h4 className="font-bold mb-2">{fileData[activeTab].fileName}</h4>
              {renderTable(currentTabData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage))}
            </>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg  ${
                currentPage === 1 ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
