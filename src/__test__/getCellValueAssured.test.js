/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValueAssured } from '../main/getCellValue.js';
import Constants from '../main/constants.js';

const BATCH_ROW = ',,Batch: 677,,,,,,,,,Date Processed: 11-16-2024,,,,,,,,,,,,,,,,'.split(',');
const CHECK_NUM_ROW = ',,,1695,,,,,,,,Community Activities: JioSupport,,,,,,,,,Donation for the Bean Bunch,,,,,,,40.00'.split(',');

describe('getCellValueAssured', () => {

    it('returns parsed batch number from the cell value if present', () => {
        const batchNumber = getCellValueAssured(BATCH_ROW, Constants.CELL_NAMES.BATCH_NUM, 10);
        expect(batchNumber).toBe("677");
    });

    it('returns amount from the cell value if present', () => {
        const amount = getCellValueAssured(CHECK_NUM_ROW, Constants.CELL_NAMES.AMOUNT, 10);
        expect(amount).toBe(40.00);
    });

    it('throws error if the cell value is not present', () => {
        expect(() => getCellValueAssured(BATCH_ROW, Constants.CELL_NAMES.RECEIPT_NUM, 10)).toThrow('ReceiptNum not found, row 10');
    });
});