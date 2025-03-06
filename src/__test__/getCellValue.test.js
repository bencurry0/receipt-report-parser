/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getCellValue } from '../main/getCellValue.js';
import Constants from '../main/constants.js';

const BATCH_ROW = ',Batch: 677,,,,,,,,,Date Processed: 11-16-2024,,,,,,,,,,,,,,,,'.split(',');
const NOT_BATCH_ROW = ',Batch:,,,,,,,,,Date Processed: 11-16-2024,,,,,,,,,,,,,,,,'.split(',');
const PADDED_BATCH_ROW = ',   Batch: 98765  ,,,,,,,,,Date Processed: 11-16-2024,,,,,,,,,,,,,,,,'.split(',');
const BAD_DATE_BATCH_ROW = ',   Batch: 98765  ,,,,,,,,,Date Processed: 11162024,,,,,,,,,,,,,,,,'.split(',');
const RECEIPT_START_ROW = ',,8765,,,,11-16-2024,,,,Cash Participants ,,,,,,,,,,,,,,,,'.split(',');
const PADDED_RECEIPT_START_ROW = ',,   8765   ,,,,11-16-2024,,,,Cash Participants ,,,,,,,,,,,,,,,,'.split(',');
const NON_NUMERIC_RECEIPT_ROW = ',,foo,,,,11-16-2024,,,,Cash Participants ,,,,,,,,,,,,,,,,'.split(',');
const BAD_RECEIPT_DATE = ',,8765,,,,11162024,,,,Cash Participants ,,,,,,,,,,,,,,,,'.split(',');
const CHECK_NUM_ROW = ',,1695,,,,,,,,Community Activities: JioSupport,,,,,,,,,Donation for the Bean Bunch,,,,,,,40.00'.split(',');
const BATCH_TOTAL_ROW = ',,,,,,,,,,,,,,,,,Batch 627 Total:,,,,,,42.81,,,'.split(',');
const BAD_BATCH_TOTAL_LABEL = ',,,,,,,,,,,,,,,,,Not a batch label: 627 Total:,,,,,,42.81,,,'.split(',');
const REPORT_TOTAL_ROW = ',,,,,,,,,,,,,,,,Grand Total of Report of Receipts:,,,,,,26295.33,,,,'.split(',');
const BADLY_LABELED_REPORT_TOTAL_ROW = ',,,,,,,,,,,,,,,,Total of Report of Receipts:,,,,,,26295.33,,,,'.split(',');

describe('getCellValue', () => {

    it('should return parsed batch number from the cell value', () => {
        const batchNumber = getCellValue(BATCH_ROW, Constants.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('677');
    });

    it('should return the empty string if the batch number is not provided or is empty', () => {
        const batchNumber = getCellValue(NOT_BATCH_ROW, Constants.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('');
    });

    it('returns batch number even if cell is padded', () => {
        const batchNumber = getCellValue(PADDED_BATCH_ROW, Constants.CELL_NAMES.BATCH_NUM);
        expect(batchNumber).toBe('98765');
    });

    it('returns batch date as string', () => {
        const batchDate = getCellValue(BATCH_ROW, Constants.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('11-16-2024');
    });

    it('returns empty string if batch date is not in date format', () => {
        const batchDate = getCellValue(BAD_DATE_BATCH_ROW, Constants.CELL_NAMES.BATCH_DATE);
        expect(batchDate).toBe('');
    });

    it('returns receipt number as string', () => {
        const receiptNum = getCellValue(RECEIPT_START_ROW, Constants.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns receipt number as string even if number is padded', () => {
        const receiptNum = getCellValue(PADDED_RECEIPT_START_ROW, Constants.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('8765');
    });

    it('returns empty string if receipt number is not numeric', () => {
        const receiptNum = getCellValue(NON_NUMERIC_RECEIPT_ROW, Constants.CELL_NAMES.RECEIPT_NUM);
        expect(receiptNum).toBe('');
    });

    it('returns receipt date as string', () => {
        const receiptDate = getCellValue(RECEIPT_START_ROW, Constants.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('11-16-2024');
    });

    it('returns empty string if receipt date is not in date format', () => {
        const receiptDate = getCellValue(BAD_RECEIPT_DATE, Constants.CELL_NAMES.RECEIPT_DATE);
        expect(receiptDate).toBe('');
    });

    it('should throw an error for an unknown cell name', () => {
        expect(() => getCellValue(BATCH_ROW, 'Foo')).toThrowError("getCellValue: Unknown cell name: 'Foo'");
    });

    it('should return the check number as a string', () => {
        expect(getCellValue(CHECK_NUM_ROW, Constants.CELL_NAMES.CHECK_NUM)).toBe('1695');
    });

    it('should return batch total as a float', () => {
        expect(getCellValue(BATCH_TOTAL_ROW, Constants.CELL_NAMES.BATCH_TOTAL)).toBe(42.81);
    });

    it('should return empty string if batch total label is missing', () => {
        expect(getCellValue(BAD_BATCH_TOTAL_LABEL, Constants.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });

    it('returns report total as a float', () => {
        expect(getCellValue(REPORT_TOTAL_ROW, Constants.CELL_NAMES.REPORT_TOTAL)).toBe(26295.33);
    });

    it('returns empty string if report total label is missing', () => {
        expect(getCellValue(BADLY_LABELED_REPORT_TOTAL_ROW, Constants.CELL_NAMES.BATCH_TOTAL)).toBe('');
    });
});
