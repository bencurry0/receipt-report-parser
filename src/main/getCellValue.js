/*
 * Copyright (c) 2024.   curryfirm.com
 */

import Constants from "./constants.js";

const DATE_REGEX = new RegExp('^\\d\\d-\\d\\d-\\d\\d\\d\\d$');

/*
 * Function to extract the datum of interest from the given row and cell, if it exists,
 * or the empty string if not.  For some cells, the entire cell content is the datum of
 * interest.  For others the datum is extracted by a capture group in a regular expression.
 */
export const getCellValue = (row, cellName) => {
    let cellValue = '';
    let match;
    let cell;
    let batch;

    switch (cellName) {

        // If possible, parse the batch number from a cell value like "Batch: 642",
        // returning the string "642", or return an empty string otherwise.
        case Constants.CELL_NAMES.BATCH_NUM:
            batch = '';
            cell = row[Constants.SOURCE_POSITIONS.BATCH_NUM];
            cellValue = (cell ? cell.trim() : '');
            match = cellValue.match(Constants.BATCH_NUM_REGEX);
            if (match) {
                batch = parseInt(match[1], 10);
            }
            return batch.toString();

        // Verify date format and return date as string, or return empty string.
        case (Constants.CELL_NAMES.BATCH_DATE):
            cell = row[Constants.SOURCE_POSITIONS.BATCH_DATE];
            cellValue = (cell ? cell.trim() : '');
            match = cellValue.match(Constants.BATCH_DATE_REGEX);
            return match ? match[1] : '';

        // Validate numeric nature of receipt num and return it as a string,
        // or return the empty string.
        case (Constants.CELL_NAMES.RECEIPT_NUM):
            cell = row[Constants.SOURCE_POSITIONS.RECEIPT_NUM];
            cellValue = (cell ? cell.trim() : '');
            cellValue = parseInt(cellValue, 10);
            return cellValue ? cellValue.toString() : '';

        // Validate xx-xx-xxxx format of receipt date and return it as a string,
        // or return the empty string.
        case (Constants.CELL_NAMES.RECEIPT_DATE):
            cell = row[Constants.SOURCE_POSITIONS.RECEIPT_DATE];
            cellValue = (cell ? cell.trim() : '');
            if (!cellValue.match(DATE_REGEX)) {
                cellValue = '';
            }
            return cellValue;

        case (Constants.CELL_NAMES.PAYOR):
            cell = row[Constants.SOURCE_POSITIONS.PAYOR];
            return (cell ? cell.trim() : '');

        case (Constants.CELL_NAMES.CHECK_NUM):
            cell = row[Constants.SOURCE_POSITIONS.CHECK_NUM];
            return (cell ? cell.trim() : '');

        case (Constants.CELL_NAMES.ACCOUNT):
            cell = row[Constants.SOURCE_POSITIONS.ACCOUNT];
            return (cell ? cell.trim() : '');

        case (Constants.CELL_NAMES.EVENT):
            cell = row[Constants.SOURCE_POSITIONS.EVENT];
            return (cell ? cell.trim() : '');

        case (Constants.CELL_NAMES.DESCRIPTION):
            cell = row[Constants.SOURCE_POSITIONS.DESCRIPTION];
            return (cell ? cell.trim() : '');

        case (Constants.CELL_NAMES.AMOUNT):
            cell = row[Constants.SOURCE_POSITIONS.AMOUNT];
            cellValue = (cell ? cell.trim() : '');
            const amount = parseFloat(cellValue.replace(/,/g, ''));
            return Number.isNaN(amount) ? '' : amount;

        // If the given row has the "Batch xxx Total:" label and if the cell value
        // in the BATCH_TOTAL position is numeric, then return it.  Otherwise,
        // return an empty string.
        case (Constants.CELL_NAMES.BATCH_TOTAL):

            // Verify presence of Batch Total label.
            cell = row[Constants.SOURCE_POSITIONS.BATCH_TOTAL_LABEL];
            cellValue = (cell ? cell.trim() : '');
            if (cellValue.match(Constants.BATCH_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total.
            cell = row[Constants.SOURCE_POSITIONS.BATCH_TOTAL];
            cellValue = (cell ? cell.trim() : '');
            const batchTotal = parseFloat(cellValue.replace(/,/g, ''));
            return Number.isNaN(batchTotal) ? '' : batchTotal;

        // If the given row has the "Grand Total of Report of Receipts:" label
        // and if the cell value in the REPORT_TOTAL position is numeric, then
        // return it.  Otherwise, return an empty string.
        case (Constants.CELL_NAMES.REPORT_TOTAL):

            // Verify presence of Batch Total label.
            cell = row[Constants.SOURCE_POSITIONS.REPORT_TOTAL_LABEL];
            cellValue = (cell ? cell.trim() : '');
            if (cellValue.match(Constants.REPORT_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total if possible.
            cell = row[Constants.SOURCE_POSITIONS.REPORT_TOTAL];
            cellValue = (cell ? cell.trim() : '');
            const reportTotal = parseFloat(cellValue.replace(/,/g, ''));
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
    const desc = getCellValue(row, Constants.CELL_NAMES.DESCRIPTION);
    const match = desc.match(Constants.BUDGET_LINE_REGEX);
    let budgetLine = '';
    if (match) {
        budgetLine = parseInt(match[1], 10);
        if (!budgetLine) {
            budgetLine = match[1];
        }
    }
    return budgetLine;
};

/*
 * Grab the description cell from the given row and parse it for key-value pairs.
 * Return the k-v pairs as a map with keys converted to upper case.
 * If the same key is used more than once in the given description cell, the last
 * k-v pair with that key rules.
 */
export const getKeyValuePairs = (row) => {
    const desc = getCellValue(row, Constants.CELL_NAMES.DESCRIPTION);
    const regex = /\b(\w+)=(".*?"|\d+)\b/g;
    const result = {};
    let match;

    while ((match = regex.exec(desc)) !== null) {
        const key = match[1];
        let value = match[2];

        // Remove quotes if it's a quoted string
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        } else {
            // Convert numeric strings to actual numbers
            value = Number(value);
        }

        result[key.toUpperCase()] = value;
    }

    return result;
}

export const isReportTotalRow = row => {
    return getCellValue(row, Constants.CELL_NAMES.REPORT_TOTAL) && true;
};

export const isBatchTotalRow = row => {
    return getCellValue(row, Constants.CELL_NAMES.BATCH_TOTAL) && true;
};

export const isBatchStartRow = row => {
    return getCellValue(row, Constants.CELL_NAMES.BATCH_NUM) && true;
};

export const isReceiptStartRow = row => {
    return getCellValue(row, Constants.CELL_NAMES.RECEIPT_NUM) && !getCellValue(row, Constants.CELL_NAMES.AMOUNT) && true;
}

export const isReceiptContinuationRow = row => {
    return getCellValue(row, Constants.CELL_NAMES.AMOUNT) && true;
}