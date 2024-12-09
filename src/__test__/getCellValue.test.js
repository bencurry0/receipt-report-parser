/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValue } from '../main/getCellValue.js';
import CONSTANTS from '../main/constants.js';
import { Row } from 'exceljs';

// Mock the Row class, really only the getCell function.
jest.mock('exceljs', () => {
    const originalModule = jest.requireActual('exceljs');
    return {
        ...originalModule,
        Row: jest.fn(() => ({
            getCell: jest.fn()
        }))
    };
});

describe('getCellValue', () => {
    let mockRow;

    beforeEach(() => {

        // Mock instance of Row
        mockRow = new Row();
    });

    it('should return parsed batch number from the cell value', () => {
        mockRow.getCell.mockReturnValueOnce({ value: 'Batch: 12345', });
        const batchNumber = getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('12345');
    });

    it('should return the empty string if the batch number is not provided or is empty', () => {
        mockRow.getCell.mockReturnValueOnce({ value: 'Batch', });
        const batchNumber = getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('');
    });

    it('returns batch number even if cell is padded', () => {
        mockRow.getCell.mockReturnValueOnce({ value: ' Batch: 98765  ', });
        const batchNumber = getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('98765');
    });

    it('returns batch date as string', () => {
        mockRow.getCell.mockReturnValueOnce({ value: 'Date Processed: 12-05-2024 ', });
        const batchDate = getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('12-05-2024');
    });

    it('returns empty string if batch date is not in date format', () => {
        mockRow.getCell.mockReturnValueOnce({ value: ' 12052024 ', });
        const batchDate = getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('');
    });

    it('returns receipt number as string', () => {
        mockRow.getCell.mockReturnValueOnce({ value: '8765', });
        const receiptNum = getCellValue(mockRow, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns receipt number as string even if number is padded', () => {
        mockRow.getCell.mockReturnValueOnce({ value: '  8765  ', });
        const receiptNum = getCellValue(mockRow, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns empty string if receipt number is not numeric', () => {
        mockRow.getCell.mockReturnValueOnce({ value: '  receipt num 8765  ', });
        const receiptNum = getCellValue(mockRow, CONSTANTS.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('');
    });

    it('returns receipt date as string', () => {
        mockRow.getCell.mockReturnValueOnce({ value: ' 12-05-2024 ' });
        const receiptDate = getCellValue(mockRow, CONSTANTS.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('12-05-2024');
    });

    it('returns empty string if receipt date is not in date format', () => {
        mockRow.getCell.mockReturnValueOnce({ value: ' 12052024 ' });
        const receiptDate = getCellValue(mockRow, CONSTANTS.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('');
    });

    it('should throw an error for an unknown cell name', () => {
        expect(() => getCellValue(mockRow, 'Foo')).toThrowError("getCellValue: Unknown cell name: 'Foo'");
    });

    it('should return the check number as a string', () => {
        mockRow.getCell.mockReturnValueOnce({ value: '1251', });
        expect(getCellValue(mockRow, CONSTANTS.CELL_NAMES.CHECK_NUM)).toBe('1251');
    });

    it('should return batch total as a float', () => {
        mockRow.getCell
            .mockImplementationOnce(() => ({ value: 'Batch 642 Total:', }))
            .mockImplementationOnce(() => ({ value: 695.22, }));
        expect(getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe(695.22);
    });

    it('should return empty string if batch total label is missing', () => {
        mockRow.getCell
            .mockImplementationOnce(() => ({ value: 'No label here', }))
            .mockImplementationOnce(() => ({ value: 695.22, }));
        expect(getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });

    it('returns report total as a float', () => {
        mockRow.getCell
            .mockImplementationOnce(() => ({ value: 'Grand Total of Report of Receipts:', }))
            .mockImplementationOnce(() => ({ value: 26295.33, }));
        expect(getCellValue(mockRow, CONSTANTS.CELL_NAMES.REPORT_TOTAL)).toBe(26295.33);
    });

    it('returns empty string if report total label is missing', () => {
        mockRow.getCell
            .mockImplementationOnce(() => ({ value: 'No label here', }))
            .mockImplementationOnce(() => ({ value: 26295.33, }));
        expect(getCellValue(mockRow, CONSTANTS.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });
});
