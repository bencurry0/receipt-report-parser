/*
 * Copyright (c) 2024.   curryfirm.com
 */

import CONSTANTS from "./constants.js";

const DATE_REGEX = new RegExp('^\\d\\d-\\d\\d-\\d\\d\\d\\d$');

/*
 * Function to extract the datum of interest from the given row and cell, if it exists,
 * or the empty string if not.  For some cells, the entire cell content is the datum of
 * interest.  For others the datum is extracted by a capture group in a regular expression.
 */
export const getCellValue = (row, cellName) => {
    let cellValue = '';
    let match;

    switch (cellName) {

        // If possible, parse the batch number from a cell value like "Batch: 642",
        // returning the string "642", or return an empty string otherwise.
        case CONSTANTS.CELL_NAMES.BATCH_NUM:
            let batch = '';
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_NUM).text || '';
            cellValue = cellValue.trim();
            match = cellValue.match(CONSTANTS.BATCH_NUM_REGEX);
            if (match) {
                batch = parseInt(match[1], 10);
            }
            return batch.toString();

        // Verify date format and return date as string, or return empty string.
        case (CONSTANTS.CELL_NAMES.BATCH_DATE):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_DATE).text || '';
            cellValue = cellValue.trim();
            if (!cellValue.match(DATE_REGEX)) {
                cellValue = '';
            }
            return cellValue;

        // Validate numeric nature of receipt num and return it as a string,
        // or return the empty string.
        case (CONSTANTS.CELL_NAMES.RECEIPT_NUM):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.RECEIPT_NUM).text || '';
            cellValue = cellValue.trim();
            cellValue = parseInt(cellValue, 10);
            return cellValue ? cellValue.toString() : '';

        // Validate xx-xx-xxxx format of receipt date and return it as a string,
        // or return the empty string.
        case (CONSTANTS.CELL_NAMES.RECEIPT_DATE):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.RECEIPT_DATE).text || '';
            cellValue = cellValue.trim();
            if (!cellValue.match(DATE_REGEX)) {
                cellValue = '';
            }
            return cellValue;

        case (CONSTANTS.CELL_NAMES.PAYOR):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.PAYOR).text || '';
            return cellValue.trim();

        case (CONSTANTS.CELL_NAMES.CHECK_NUM):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.CHECK_NUM).text || '';
            return cellValue.trim();

        case (CONSTANTS.CELL_NAMES.ACCOUNT):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.ACCOUNT).text || '';
            return cellValue.trim();

        case (CONSTANTS.CELL_NAMES.EVENT):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.EVENT) || '';
            return cellValue.toString().trim();

        case (CONSTANTS.CELL_NAMES.DESCRIPTION):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.DESCRIPTION) || '';
            return cellValue.toString().trim();

        case (CONSTANTS.CELL_NAMES.AMOUNT):
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.AMOUNT) || '';
            cellValue = cellValue.toString().trim();
            const amount = parseFloat(cellValue);
            return Number.isNaN(amount) ? '' : amount;

        // If the given row has the "Batch xxx Total:" label and if the cell value
        // in the BATCH_TOTAL position is numeric, then return it.  Otherwise,
        // return an empty string.
        case (CONSTANTS.CELL_NAMES.BATCH_TOTAL):

            // Verify presence of Batch Total label.
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_TOTAL_LABEL);
            if (!cellValue) {
                cellValue = '';
            }
            cellValue = cellValue.value;
            cellValue = cellValue.trim();
            if (cellValue.match(CONSTANTS.BATCH_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total if possible.
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_TOTAL) || '';
            cellValue = cellValue.toString().trim();
            const batchTotal = parseFloat(cellValue);
            return Number.isNaN(batchTotal) ? '' : batchTotal;

        // If the given row has the "Grand Total of Report of Receipts:" label
        // and if the cell value in the REPORT_TOTAL position is numeric, then
        // return it.  Otherwise, return an empty string.
        case (CONSTANTS.CELL_NAMES.REPORT_TOTAL):

            // Verify presence of Batch Total label.
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.REPORT_TOTAL_LABEL) || '';
            cellValue = cellValue.toString().trim();
            if (cellValue.match(CONSTANTS.REPORT_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total if possible.
            cellValue = row.getCell(CONSTANTS.SOURCE_POSITIONS.REPORT_TOTAL) || '';
            cellValue = cellValue.toString().trim();
            const reportTotal = parseFloat(cellValue);
            return Number.isNaN(reportTotal) ? '' : reportTotal;

        default:
            throw new Error(`getCellValue: Unknown cell name: \'${cellName}\'`);
    }
}

/*
 * Just like getCellValue except throws an error if the cell
 * value sought is not found.
 */
export const getCellValueAssured = (row, cellName, rowNumber) => {
    const value = getCellValue(row, cellName);
    if (!value) {
        throw new Error(`${cellName} not found, row ${rowNumber}`);
    }
    return value;
}

export const getBudgetLine = (row) => {
    const desc = getCellValue(row, CONSTANTS.CELL_NAMES.DESCRIPTION);
    const match = desc.toString().match(CONSTANTS.BUDGET_LINE_REGEX);
    let budgetLine = '';
    if (match) {
        budgetLine = parseInt(match[1], 10);
        if (!budgetLine) {
            budgetLine = match[1];
        }
    }
    return budgetLine;
};