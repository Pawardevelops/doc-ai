const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');
const { read, readFile, utils } = require("xlsx");

async function processExcelDataFromString(base64Excel) {
  const buffer = Buffer.from(base64Excel, "base64");
  const workbook = read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(worksheet);
  return JSON.stringify(jsonData); // Convert the Excel sheet to JSON string
}

async function processExcelData(filePath) {
  const workbook = readFile(filePath); // Use `readFile` from xlsx
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(worksheet); // Use `sheet_to_json` from xlsx
  return JSON.stringify(jsonData); // Convert the Excel sheet to JSON string
}

async function processCsvData(csvFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length === 0) {
          reject("Error: The CSV file is empty");
          return;
        }
        const headers = Object.keys(results[0]);
        let csvString = headers.join(',') + '\n';
        results.forEach((row) => {
          const rowValues = headers.map((header) => row[header]);
          csvString += rowValues.join(',') + '\n';
        });
        resolve(csvString);
      })
      .on('error', (error) => {
        reject(`Error reading CSV file: ${error.message}`);
      });
  });
}

async function processCsvDataFromString(csvString) {
  return new Promise((resolve, reject) => {
    const results = [];
    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(csvString);
    readable.push(null); // indicate the end of the data

    readable
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length === 0) {
          reject("Error: The CSV string is empty");
          return;
        }
        const headers = Object.keys(results[0]);
        let csvStringResult = headers.join(',') + '\n';
        results.forEach((row) => {
          const rowValues = headers.map((header) => row[header]);
          csvStringResult += rowValues.join(',') + '\n';
        });
        resolve(csvStringResult);
      })
      .on('error', (error) => {
        reject(`Error parsing CSV string: ${error.message}`);
      });
  });
}

module.exports = { processCsvData, processCsvDataFromString, processExcelData, processExcelDataFromString };
