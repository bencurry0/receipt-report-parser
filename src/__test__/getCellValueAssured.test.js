/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValueAssured } from '../main/getCellValue.js';
import CONSTANTS from '../main/constants.js';

describe('getCellValueAssured', () => {
    let row;

    beforeEach(() => {

        // Mock row and getCell.
        row = {
            getCell: jest.fn(),
        };
    });

    it('returns parsed batch number from the cell value if present', () => {
        row.getCell.mockReturnValueOnce({ value: 'Batch: 12345' });
        const batchNumber = getCellValueAssured(row, CONSTANTS.CELL_NAMES.BATCH_NUM, 10);
        expect(batchNumber).toBe("12345");
    });

    it('returns amount from the cell value if present', () => {
        row.getCell.mockReturnValueOnce({ value: 12345.67 });
        const amount = getCellValueAssured(row, CONSTANTS.CELL_NAMES.AMOUNT, 10);
        expect(amount).toBe(12345.67);
    });

    it('throws error if the cell value is not present', () => {
        row.getCell.mockReturnValueOnce({ value: '' });
        expect(() => getCellValueAssured(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM, 10)).toThrow('ReceiptNum not found, row 10');
    });
});