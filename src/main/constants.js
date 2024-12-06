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
    BATCH_NUM: 3,
    BATCH_DATE: 12,
    RECEIPT_NUM: 4,
    RECEIPT_DATE: 8,
    PAYOR: 12,
    CHECK_NUM: 4,
    ACCOUNT: 12,
    EVENT: 17,
    DESCRIPTION: 21,
    AMOUNT: 28,
    BATCH_TOTAL_LABEL: 19,
    BATCH_TOTAL: 25,
    REPORT_TOTAL_LABEL: 18,
    REPORT_TOTAL: 24,
});

const batchNumRegex = new RegExp('^Batch: (\\d+)$');
const batchTotalLabelRegex = new RegExp('^Batch (\\d+) Total:$');
const budgetLineRegex = new RegExp('^bli=(\\d+|\\w+)\\b');
const reportTotalLabelRegex = new RegExp('Grand Total of Report of Receipts:');

const CONSTANTS = Object.freeze({
    CELL_NAMES: cellNames,
    SOURCE_POSITIONS: positions,
    BATCH_NUM_REGEX: batchNumRegex,
    BATCH_TOTAL_LABEL_REGEXP: batchTotalLabelRegex,
    BUDGET_LINE_REGEX: budgetLineRegex,
    REPORT_TOTAL_LABEL_REGEXP: reportTotalLabelRegex,
});

export default CONSTANTS;