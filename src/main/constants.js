/*
 * Copyright (c) 2024.   curryfirm.com
 */

const cellNames = Object.freeze({
    BATCH_NUM: 'BatchNum',
    BATCH_DATE: 'BatchDate',
    RECEIPT_NUM: 'ReceiptNum',
    RECEIPT_DATE: 'ReceiptDate',
    PAYOR: 'Payor',
    CHECK_NUM: 'CheckNum',
    ACCOUNT: 'Account',
    EVENT: 'Event',
    DESCRIPTION: 'Description',
    AMOUNT: 'Amount',
    BATCH_TOTAL: 'BatchTotal',
    REPORT_TOTAL: 'ReportTotal',
});

// Listed in order of encoutering in input, left-to-right, top-to-bottom
const positions = Object.freeze({
    BATCH_NUM: 2,
    BATCH_DATE: 11,
    RECEIPT_NUM: 3,
    RECEIPT_DATE: 7,
    PAYOR: 11,
    CHECK_NUM: 3,
    ACCOUNT: 11,
    EVENT: 16,
    DESCRIPTION: 20,
    AMOUNT: 27,
    BATCH_TOTAL_LABEL: 18,
    BATCH_TOTAL: 24,
    REPORT_TOTAL_LABEL: 17,
    REPORT_TOTAL: 23,
});

const datePattern = '((0\\d|1[012])-([012]\\d|3[01])-\\d{4})';
const dateRegex = new RegExp('(^' + datePattern + '$)');
const batchNumRegex = new RegExp('^Batch: (\\d+)$');
const batchDateRegex = new RegExp('^Date Processed: (' + datePattern + ')$');
const batchTotalLabelRegex = new RegExp('^Batch (\\d+) Total:$');
const budgetLineRegex = new RegExp('^bli=(\\d+|\\w+)\\b');
const reportTotalLabelRegex = new RegExp('Grand Total of Report of Receipts:');

const CONSTANTS = Object.freeze({
    CELL_NAMES: cellNames,
    SOURCE_POSITIONS: positions,
    DATE_REGEX: dateRegex,
    BATCH_NUM_REGEX: batchNumRegex,
    BATCH_DATE_REGEX: batchDateRegex,
    BATCH_TOTAL_LABEL_REGEXP: batchTotalLabelRegex,
    BUDGET_LINE_REGEX: budgetLineRegex,
    REPORT_TOTAL_LABEL_REGEXP: reportTotalLabelRegex,
});

export default CONSTANTS;