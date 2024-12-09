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
    let cell;
    let batch;

    switch (cellName) {

        // If possible, parse the batch number from a cell value like "Batch: 642",
        // returning the string "642", or return an empty string otherwise.
        case CONSTANTS.CELL_NAMES.BATCH_NUM:
            batch = '';
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_NUM);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            match = cellValue.match(CONSTANTS.BATCH_NUM_REGEX);
            if (match) {
                batch = parseInt(match[1], 10);
            }
            return batch.toString();

        // Verify date format and return date as string, or return empty string.
        case (CONSTANTS.CELL_NAMES.BATCH_DATE):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_DATE);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            match = cellValue.match(CONSTANTS.BATCH_DATE_REGEX);
            return match ? match[1] : '';

        // Validate numeric nature of receipt num and return it as a string,
        // or return the empty string.
        case (CONSTANTS.CELL_NAMES.RECEIPT_NUM):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.RECEIPT_NUM);
            cellValue = ((cell && cell.value) ? cell.value.toString() : '');
            cellValue = parseInt(cellValue, 10);
            return cellValue ? cellValue.toString() : '';

        // Validate xx-xx-xxxx format of receipt date and return it as a string,
        // or return the empty string.
        case (CONSTANTS.CELL_NAMES.RECEIPT_DATE):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.RECEIPT_DATE);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            if (!cellValue.match(DATE_REGEX)) {
                cellValue = '';
            }
            return cellValue;

        case (CONSTANTS.CELL_NAMES.PAYOR):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.PAYOR);
            return (cell && cell.value) ? cell.value.toString().trim() : '';

        case (CONSTANTS.CELL_NAMES.CHECK_NUM):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.CHECK_NUM);
            return (cell && cell.value) ? cell.value.toString().trim() : '';

        case (CONSTANTS.CELL_NAMES.ACCOUNT):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.ACCOUNT);
            return (cell && cell.value) ? cell.value.toString().trim() : '';

        case (CONSTANTS.CELL_NAMES.EVENT):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.EVENT);
            return (cell && cell.value) ? cell.value.toString().trim() : '';

        case (CONSTANTS.CELL_NAMES.DESCRIPTION):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.DESCRIPTION);
            return cell ? cell.value.toString().trim() : '';

        case (CONSTANTS.CELL_NAMES.AMOUNT):
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.AMOUNT);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            const amount = parseFloat(cellValue);
            return Number.isNaN(amount) ? '' : amount;

        // If the given row has the "Batch xxx Total:" label and if the cell value
        // in the BATCH_TOTAL position is numeric, then return it.  Otherwise,
        // return an empty string.
        case (CONSTANTS.CELL_NAMES.BATCH_TOTAL):

            // Verify presence of Batch Total label.
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_TOTAL_LABEL);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            cellValue = cellValue.trim();
            if (cellValue.match(CONSTANTS.BATCH_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total.
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.BATCH_TOTAL);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            const batchTotal = parseFloat(cellValue);
            return Number.isNaN(batchTotal) ? '' : batchTotal;

        // If the given row has the "Grand Total of Report of Receipts:" label
        // and if the cell value in the REPORT_TOTAL position is numeric, then
        // return it.  Otherwise, return an empty string.
        case (CONSTANTS.CELL_NAMES.REPORT_TOTAL):

            // Verify presence of Batch Total label.
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.REPORT_TOTAL_LABEL);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
            if (cellValue.match(CONSTANTS.REPORT_TOTAL_LABEL_REGEXP) === null) {
                return '';
            }

            // Get the batch total if possible.
            cell = row.getCell(CONSTANTS.SOURCE_POSITIONS.REPORT_TOTAL);
            cellValue = ((cell && cell.value) ? cell.value.toString().trim() : '');
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
    const match = desc.match(CONSTANTS.BUDGET_LINE_REGEX);
    let budgetLine = '';
    if (match) {
        budgetLine = parseInt(match[1], 10);
        if (!budgetLine) {
            budgetLine = match[1];
        }
    }
    return budgetLine;
};

export const isReportTotalRow = row => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.REPORT_TOTAL) && true;
};

export const isBatchTotalRow = row => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL) && true;
};

export const isBatchStartRow = row => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM) && true;
};

export const isReceiptStartRow = row => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM) && !getCellValue(row, CONSTANTS.CELL_NAMES.AMOUNT) && true;
}

export const isReceiptContinuationRow = row => {
    return getCellValue(row, CONSTANTS.CELL_NAMES.AMOUNT) && true;
}
