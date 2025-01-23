import { initializeGemini } from "@/utils/gemini";
import { processCsvData, processCsvDataFromString } from "@/utils/csv_parser";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userQuery, csvData, csvFilePath } = await req.json();

    if (!userQuery) {
      return NextResponse.json({ error: "User query is required." }, { status: 400 });
    }

    const model = initializeGemini();

    const prompt = `You are a helpful assistant with data analysis capabilities.
    You will receive a CSV file and a query. Respond to the query based on the CSV data and give formated and detailed response.

    CSV Data:
    \`\`\`
    ${csvData}
    \`\`\`

    Query:
    ${userQuery}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(result)

    // Ensure a response is returned
    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error from Gemini or during processing:", error);

    // Catch all errors and return a proper response
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
