/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValueAssured, getBudgetLine, getCellValue } from "./getCellValue.js";
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

const isSplitRow = (row) => {
    return !(getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM)
        || getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM)
        || getCellValue(row, CONSTANTS.CELL_NAMES.CHECK_NUM)
        || getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL)
        || getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL)
        || getCellValue(row, CONSTANTS.CELL_NAMES.REPORT_TOTAL))
    && getCellValue(row, CONSTANTS.CELL_NAMES.ACCOUNT);
}

const isReceiptRow = (row) => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM) && !getCellValue(row, CONSTANTS.CELL_NAMES.AMOUNT);
}

const isBatchTotalRow = (row) => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL) && true;
}

const isReportTotalRow = (row) => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.REPORT_TOTAL) && true;
}

/*
 * Iteratively read the rows of the input Receipt Report worksheet, scanning for the expected
 * data in the expected sequence of cells and rows.  The idea is to read input rows until we have built
 * up in memory the attributes of all the receipts of a particular batch.  Then we make sure the total
 * of the amounts of the receipts matches the Batch Total read from the input worksheet.  If it does,
 * we write the receipt attributes to "rowsToOutput," one row per receipt.  If it doesn't, we try to
 * match the given Batch Total by deleting duplicate receipts from our accumulation.  Such duplication
 * occurs in the input data because of the way the input worksheet does vertical cell merging for
 * presentation purposes.  In fact, the whole reason this application exists is to re-cast the Receipt
 * Report data in a one-row-per-receipt, machine-tractable format that we can use as the source for filtering
 * and pivot tables.
 *
 * This application gives up easily when it encounters formatting that it does not expect.  Better to quit
 * than to render incorrect output.
 */
async function readAndExtractData() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputFilePath);
    const worksheet = workbook.getWorksheet(1);

    // An array of receipt objects, one per element.
    const outputRows = [];

    // Variable to indicate whether we are in the process of accumulating a batch and, if so,
    // what its batch number is.
    let batchNum;
    let batchDate;
    let receiptNum;
    let receiptDate;
    let payor;
    let transfer;
    let checkNum;
    let account;
    let event;
    let description;
    let budgetLine;
    let amount;

    // Loop through each row in the worksheet
    worksheet.eachRow((row, rowNumber) => {

        // If not currently accumulating a batch, skip forward to the next row that starts a batch.
        if (!batchNum) {
            batchNum = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM);
            if (!batchNum) {
                return;
            }
            batchDate = getCellValueAssured(row, CONSTANTS.CELL_NAMES.BATCH_DATE, rowNumber);

            // Continue on next input row, seeking receipt number.
            return;
        }

        if (!receiptNum) {
            receiptNum = getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM, rowNumber);
            receiptDate = getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_DATE, rowNumber);
            payor = getCellValueAssured(row, CONSTANTS.CELL_NAMES.PAYOR, rowNumber);
            transfer = (payor.toString().trim().toLowerCase() === TRANSFER_IN);

            // Continue on next input row, seeking remaining receipt attributes.
            return;
        }

        if (!account) {
            checkNum = getCellValue(row, CONSTANTS.CELL_NAMES.CHECK_NUM); // Optionally present in input.
            account = getCellValueAssured(row, CONSTANTS.CELL_NAMES.ACCOUNT, rowNumber);
            event = getCellValue(row, CONSTANTS.CELL_NAMES.EVENT);    // Optionally present in input.
            description = getCellValue(row, CONSTANTS.CELL_NAMES.DESCRIPTION);    // Optionally present in input.
            budgetLine = getBudgetLine(row);
            amount = getCellValueAssured(row, CONSTANTS.CELL_NAMES.AMOUNT, rowNumber);

            // Unless it is split, the current receipt info is now completely known; bank it.
            // If it is split or if it is a duplicate row, we'll find out and fix it on a subsequent iteration.
            outputRows.push({
                batchNum, batchDate, receiptNum, receiptDate, payor, transfer, checkNum, account, event, budgetLine,
                description, amount,
            });
            // Continue to next input row, seeking split receipt part, next receipt, or batch total.
        }
        else if (isSplitRow(row)) {

            // This is the 2nd or subsequent split of a split receipt.  Capture split details.
            account = getCellValueAssured(row, CONSTANTS.CELL_NAMES.ACCOUNT, rowNumber);
            event = getCellValue(row, CONSTANTS.CELL_NAMES.EVENT);    // Optionally present in input.
            description = getCellValue(row, CONSTANTS.CELL_NAMES.DESCRIPTION);    // Optionally present in input.
            budgetLine = getBudgetLine(row);
            amount = getCellValueAssured(row, CONSTANTS.CELL_NAMES.AMOUNT, rowNumber);

            // Mark the previously banked receipt row as split.
            outputRows[outputRows.length - 1].split = true;

            // Capture the new split details.
            outputRows.push({
                batchNum, batchDate, receiptNum, receiptDate, payor, transfer, checkNum, account, event, budgetLine,
                description, amount, split: true,
            });
            // Continue to next input row, seeking remaining splits or receipts.
        }
        else if (isReceiptRow(row)) {

            // This is the 2nd or subsequent receipt in the batch.  Capture it.
            receiptNum = getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM, rowNumber);
            receiptDate = getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_DATE, rowNumber);
            payor = getCellValueAssured(row, CONSTANTS.CELL_NAMES.PAYOR, rowNumber);
            transfer = (payor.toString().trim().toLowerCase() === TRANSFER_IN);
            account = undefined;
            // Continue on next input row, seeking remaining receipt attributes.
        }
        else if (isBatchTotalRow(row, rowNumber)) {
            // Fix up outputRows of batch to ensure totals match batch total.
        }
        else if (isReportTotalRow(row, rowNumber)) {
            // Ensure sum of row amounts equals report grand total.
        }

        // let rowObject = {};
        //
        // // Extract cell values into the rowObject.
        // for (let i = 1; i <= numCols; i++) {
        //     const cellValue = row.getCell(i).text || '';  // Default to empty string if value is missing
        //     rowObject[`col${i}`] = cellValue.trim();  // Trim spaces if any
        //     console.log(`row ${rowNumber}, col ${i}: ` + rowObject[`col${i}`]);
        // }
        //
        // // Push the rowObject to extractedData.
        // if (Object.keys(rowObject).length > 0) {
        //     extractedData.push(rowObject);
        // }
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
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
