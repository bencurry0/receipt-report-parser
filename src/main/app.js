/*
 * Copyright (c) 2024.   curryfirm.com
 */

// import { getCellValueAssured, getBudgetLine, getCellValue } from "./getCellValue.js";
import * as myRow from "./getCellValue.js";
import CONSTANTS from './constants.js';

// app.js
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the file paths and number of columns to extract.
const inputFilePath = path.join(__dirname, '../../data', 'ReceiptDetailByDateReport.xlsx');
const outputFilePath = path.join(__dirname, '../../data', 'output.csv');
const TRANSFER_IN = 'internal transfer in';

const outputRows = [];
const outputRow = {};

const clearRow = outRow => {
    Object.keys(outRow).forEach(key => {
        outputRow[key] = undefined;
    });
}

/*
 * Iteratively read the rows of the input Receipt Report worksheet, scanning for the expected
 * data in the expected sequence of cells and rows.  Bank the data in homogeneous, denormalized
 * rows in memory, which can be dumped to a .csv file and used later as the basis for filtering and pivot tables.
 */
async function readAndExtractData() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);
    const worksheet = workbook.getWorksheet(1);

    // Loop through each row in the worksheet
    worksheet.eachRow((row, rowNumber) => {

        if (myRow.isReportTotalRow(row)) {

            // Get report total from input row; compute it from banked data; compare.
            const reportTotalRead = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.REPORT_TOTAL, rowNumber);
            const reportTotalComputed = outputRows.reduce((total, receiptRow) => total + receiptRow.amount, 0);
            if (!(reportTotalRead === reportTotalComputed)) {
                throw new Error('Input report grand total does not match total of receipts scanned.');
            }
            return;
        }
        if (myRow.isBatchTotalRow(row)) {

            // Done with currently accumulating receipt.
            clearRow(outputRow);

            // Get batch total from input row; compute it from banked data; compare.
            const batchTotalRead = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL, rowNumber);
            const batchNum = outputRows[outputRows.length - 1].batchNum;
            const batchTotalComputed = outputRows.filter(receiptRow => receiptRow.batchNum === batchNum)
                .reduce((total, receiptRow) => total + receiptRow.amount, 0);
            if (!(batchTotalRead === batchTotalComputed)) {
                throw new Error(`Reported batch total does not match total of receipts scanned for batch ${batchNum}.`);
            }
            return;
        }
        if (myRow.isBatchStartRow(row)) {

            // Done with currently accumulating receipt.
            clearRow(outputRow);

            outputRow.batchNum = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.BATCH_NUM, rowNumber);
            outputRow.batchDate = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.BATCH_DATE, rowNumber);
            return;
        }
        if (myRow.isReceiptStartRow(row)) {

            // This could be the start of the second or subsequent receipt in the current batch;
            // batchNum and batchDate are already in outputRow. Glean the info from the present input row.
            outputRow.receiptNum = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM, rowNumber);
            outputRow.receiptDate = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_DATE, rowNumber);
            outputRow.payor = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.PAYOR, rowNumber);
            outputRow.transfer = (outputRow.payor.toString().trim().toLowerCase() === TRANSFER_IN);
            return;
        }
        if (myRow.isReceiptContinuationRow(row)) {
            outputRow.account = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.ACCOUNT, rowNumber);
            outputRow.event = myRow.getCellValue(row, CONSTANTS.CELL_NAMES.EVENT);    // Optionally present in input.
            outputRow.description = myRow.getCellValue(row, CONSTANTS.CELL_NAMES.DESCRIPTION);    // Optionally present in input.
            outputRow.budgetLine = myRow.getBudgetLine(row);
            outputRow.amount = myRow.getCellValueAssured(row, CONSTANTS.CELL_NAMES.AMOUNT, rowNumber);

            // Assume a split receipt's parts are consecutive in the input.  If the last output row bears the
            // same receipt number as the one currently being accumulated, mark both as split.
            if ((outputRows.length > 0) && (outputRows[outputRows.length - 1].receiptNum === outputRow.receiptNum)) {
                outputRows[outputRows.length - 1].split = true;
                outputRow.split = true;

                // Don't capture check number here.  It was captured when we processed the
                // continuation of the first part of the split receipt, and it applies to
                // all parts of the split receipt.  Don't overwrite it.
            }
            else {

                // This is the continuation of the first part of a split receipt,
                // or, more likely, it is the continuation af an unsplit receipt.
                // In either case, this is where we capture the check number (or "cash")
                // from the input row.  Its presence is optional in the input.
                outputRow.checkNum = myRow.getCellValue(row, CONSTANTS.CELL_NAMES.CHECK_NUM);
            }

            // Data are complete for this receipt or split of receipt.  Bank the outputRow.
            // Don't clear the outputRow; another piece of the split could be coming.
            outputRows.push(outputRow);
        }
    });

    return outputRows;
}

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