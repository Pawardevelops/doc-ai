"use client";
import React from "react";

export const FileContent = ({className, fileData, renderTable }) => {
  return (
    <div className={className}>
      <div className="mb-4">
        <p className="italic text-sm">
          {fileData.length > 0
            ? `${fileData.length} file(s) uploaded successfully.`
            : "No files uploaded yet."}
        </p>
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 p-4 rounded-lg">
          {fileData.map((file, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-bold mb-2">{file.fileName}</h4>
              {renderTable(file.content)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
