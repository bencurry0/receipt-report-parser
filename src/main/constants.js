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

// Listed in order of encountering in input, left-to-right, top-to-bottom
const positions = Object.freeze({
    BATCH_NUM: 1,
    BATCH_DATE: 10,
    RECEIPT_NUM: 2,
    RECEIPT_DATE: 6,
    PAYOR: 10,
    CHECK_NUM: 2,
    ACCOUNT: 10,
    EVENT: 15,
    DESCRIPTION: 19,
    AMOUNT: 26,
    BATCH_TOTAL_LABEL: 17,
    BATCH_TOTAL: 23,
    REPORT_TOTAL_LABEL: 16,
    REPORT_TOTAL: 22,
});

const datePattern = '((0\\d|1[012])-([012]\\d|3[01])-\\d{4})';
const dateRegex = new RegExp('(^' + datePattern + '$)');
const batchNumRegex = new RegExp('^Batch: (\\d+)$');
const batchDateRegex = new RegExp('^Date Processed: (' + datePattern + ')$');
const batchTotalLabelRegex = new RegExp('^Batch (\\d+) Total:$');
const budgetLineRegex = new RegExp('^bli=(\\d+|\\w+)\\b');
const reportTotalLabelRegex = new RegExp('Grand Total of Report of Receipts:');

const Constants = Object.freeze({
    CELL_NAMES: cellNames,
    SOURCE_POSITIONS: positions,
    DATE_REGEX: dateRegex,
    BATCH_NUM_REGEX: batchNumRegex,
    BATCH_DATE_REGEX: batchDateRegex,
    BATCH_TOTAL_LABEL_REGEXP: batchTotalLabelRegex,
    BUDGET_LINE_REGEX: budgetLineRegex,
    REPORT_TOTAL_LABEL_REGEXP: reportTotalLabelRegex,
    INPUT_DIR: '/home/bencurry0/Kofc6250/KofC6250@gmail.com/Finance/FY2025/Supreme',
    OUTPUT_DIR: '/home/bencurry0/Kofc6250/KofC6250@gmail.com/Finance/FY2025/Supreme',
    INPUT_FILE: 'ReceiptDetailByDateReport.csv',
    OUTPUT_FILE: 'receipts.csv',
});

export default Constants;