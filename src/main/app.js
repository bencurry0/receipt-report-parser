/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { processRow } from './receiptReportParser.js'

import fs from 'fs';
import Papa from 'papaparse';

import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the file paths and read the input as a single string.
const outputFilePath = path.join(__dirname, '../../data', 'output.csv');
const inputFilePath = path.join(__dirname, '../../data', 'ReceiptDetailByDateReport.xls - receiptDetail.csv');
const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');

// Array in which to accumulate the output rows appropriate for filters and pivot tables.
const outputRows = [];


/*
 * Iteratively read the rows of the input Receipt Report worksheet, scanning for the expected
 * data in the expected sequence of cells and rows.  Bank the data in homogeneous, denormalized
 * rows in memory, which can be dumped to a .csv file and used later as the basis for filtering and pivot tables.
 */
async function readAndExtractData() {
    let rowNumber = 0;

    Papa.parse(inputFileContent, {
        delimiter: ',',
        quoteChar: '"',
        header: false,
        dynamicTyping: false,
        skipEmptyLines: false,

        // Here's the function that loops through the input data.
        step: function (result, parser) {
            const row = result.data;
            rowNumber++;
            processRow(row, rowNumber, outputRows);
        },

        complete: function () {
            console.log('Parsing complete');
        }
    });
    return outputRows;
}
// }

// Function to write the extracted data to a CSV file
async function writeToCSV(data) {
    const myHeader = [
        {id: 'batchNum', title: 'BatchNumber'},
        {id: 'batchDate', title: 'DateProcessed'},
        {id: 'receiptNum', title: 'ReceiptNumber'},
        {id: 'receiptDate', title: 'ReceiptDate'},
        {id: 'payor', title: 'Payor'},
        {id: 'transfer', title: 'Transfer'},
        {id: 'checkNum', title: 'CheckNumber'},
        {id: 'account', title: 'Account'},
        {id: 'event', title: 'Event'},
        {id: 'budgetLine', title: 'BudgetLine'},
        {id: 'description', title: 'Description'},
        {id: 'amount', title: 'Amount'},
        {id: 'split', title: 'Split'},
    ];
    const csvWriter = createObjectCsvWriter({
        path: outputFilePath,
        header: myHeader
    });

    // Write the data to the CSV
    await csvWriter.writeRecords(data);
    console.log(`Data has been written to ${outputFilePath}`);
}

// Main function to execute the process
async function main() {
    try {
        console.log('Reading and extracting data from Excel file...');
        const outputRows = await readAndExtractData();
        console.log('Writing extracted data to CSV file...');
        await writeToCSV(outputRows);
        console.log('Application finished successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Wrapper function to start app and respect promise from main().
async function startApp() {
    try {
        await main();
    }
    catch (error) {
        console.error('Error during app execution:', error);
    }
}

startApp().then(() => console.log('')).catch((error) => console.error('App failed:', error));