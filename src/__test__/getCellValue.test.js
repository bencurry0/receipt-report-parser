/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValue } from '../main/getCellValue.js';
import CONSTANTS from '../main/constants.js';

describe('getCellValue', () => {
    let row;

    beforeEach(() => {

        // Mock row and getCell.
        row = {
            getCell: jest.fn(),
        };
    });

    it('should return parsed batch number from the cell value', () => {
        row.getCell.mockReturnValueOnce({text: 'Batch: 12345'});
        const batchNumber = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('12345');
    });

    it('should return the empty string if the batch number is not provided or is empty', () => {
        row.getCell.mockReturnValueOnce({text: 'Batch: '});
        const batchNumber = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('');
    });

    it('returns batch number even if cell is padded', () => {
        row.getCell.mockReturnValueOnce({text: ' Batch: 98765  '});
        const batchNumber = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('98765');
    });

    it('returns batch date as string', () => {
        row.getCell.mockReturnValueOnce({text: ' 12-05-2024 '});
        const batchDate = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('12-05-2024');
    });

    it('returns empty string if batch date is not in date format', () => {
        row.getCell.mockReturnValueOnce({text: ' 12052024 '});
        const batchDate = getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('');
    });

    it('returns receipt number as string', () => {
        row.getCell.mockReturnValueOnce({text: '8765'});
        const receiptNum = getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns receipt number as string even if number is padded', () => {
        row.getCell.mockReturnValueOnce({text: '  8765  '});
        const receiptNum = getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns empty string if receipt number is not numeric', () => {
        row.getCell.mockReturnValueOnce({text: '  receipt num 8765  '});
        const receiptNum = getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('');
    });

    it('returns receipt date as string', () => {
        row.getCell.mockReturnValueOnce({text: ' 12-05-2024 '});
        const receiptDate = getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('12-05-2024');
    });

    it('returns empty string if receipt date is not in date format', () => {
        row.getCell.mockReturnValueOnce({text: ' 12052024 '});
        const receiptDate = getCellValue(row, CONSTANTS.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('');
    });

    it('should throw an error for an unknown cell name', () => {
        expect(() => getCellValue(row, 'Foo')).toThrowError("getCellValue: Unknown cell name: 'Foo'");
    });

    it('should return the check number as a string', () => {
        row.getCell.mockReturnValueOnce({text: '1251'});
        expect(getCellValue(row, CONSTANTS.CELL_NAMES.CHECK_NUM)).toBe('1251');
    });

    it('should return batch total as a float', () => {
        row.getCell
            .mockImplementationOnce(() => { text: 'Batch 642 Total:' });
            // .mockImplementationOnce(() => 695.22);
        expect(getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe(695.22);
    });

    it('should return empty string if batch total label is missing', () => {
        row.getCell
            .mockImplementationOnce(() => { text: 'No label here' })
            .mockImplementationOnce(() => { value: 695.22 });
        expect(getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });

    it('returns report total as a float', () => {
        row.getCell
            .mockImplementationOnce(() => 'Grand Total of Report of Receipts:')
            .mockImplementationOnce(() => 26295.33);
        expect(getCellValue(row, CONSTANTS.CELL_NAMES.REPORT_TOTAL)).toBe(26295.33);
    });

    it('returns empty string if report total label is missing', () => {
        row.getCell
            .mockImplementationOnce(() => 'No label here')
            .mockImplementationOnce(() => 26295.33);
        expect(getCellValue(row, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });
});
