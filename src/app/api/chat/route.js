import { initializeGemini } from "@/utils/gemini";
import { processCsvData, processCsvDataFromString } from "@/utils/csv_parser";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      const { userQuery, fileData } = await req.json();
  
      if (!userQuery) {
        return NextResponse.json({ error: "User query is required." }, { status: 400 });
      }
  
      if (!fileData || !fileData.length) {
        return NextResponse.json({ error: "At least one file's data is required." }, { status: 400 });
      }
  
      // Serialize each file's content properly
      const combinedData = fileData
        .map((file, index) => {
          // Serialize content as JSON if it's an array of objects
          let contentString;
          if (Array.isArray(file.content)) {
            // Check if content is an array of objects or a simple array
            contentString = file.content.every((row) => typeof row === "object")
              ? file.content.map((row) => JSON.stringify(row)).join("\n") // Convert each object to a JSON string
              : file.content.join("\n"); // Handle simple arrays
          } else {
            // If content is not an array, just stringify it
            contentString = JSON.stringify(file.content, null, 2);
          }
  
          return `File ${index + 1}: ${file.fileName}\n\`\`\`\n${contentString}\n\`\`\`\n`;
        })
        .join("\n");
  
      const model = initializeGemini();
  
      console.log(combinedData);
  
      const prompt = `You are a helpful assistant with data analysis capabilities.
      You will receive data from multiple files and a query. Respond to the query based on the data and provide a detailed, formatted response.
  
      Combined File Data:
      ${combinedData}
  
      Query:
      ${userQuery}`;
  
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
  
      console.log(result);
  
      return NextResponse.json({ response: responseText }, { status: 200 });
    } catch (error) {
      console.error("Error from Gemini or during processing:", error);
  
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again later." },
        { status: 500 }
      );
    }
  }
  
