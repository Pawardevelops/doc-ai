"use client";
import React from "react";
import Markdown from "react-markdown";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";
import { Cover } from "./cover";

export const ChatSection = ({ chat, loading, setUserQuery, handleSubmit }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 max-h-[400px] overflow-y-auto">
      {chat.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.type === "user" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`inline-block rounded-lg p-4 ${
              message.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {message.type === "ai" ? (
              <Markdown>{message.message}</Markdown>
            ) : (
              <p>{message.message}</p>
            )}
          </div>
        </div>
      ))}

      {/* Thinking state for AI */}
      {loading && (
        <div className="mb-4 text-left">
          <div className="inline-block rounded-lg p-4 bg-gray-200 text-black">
            <Cover>Thinking...</Cover>
          </div>
        </div>
      )}

      {/* Input section */}
      <PlaceholdersAndVanishInput
        placeholders={[
          "Ask a question...",
          "Summarize the data...",
          "Find insights...",
        ]}
        onChange={(e) => setUserQuery(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
