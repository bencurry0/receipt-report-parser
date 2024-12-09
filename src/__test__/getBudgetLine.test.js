/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getBudgetLine } from '../main/getCellValue.js';
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

describe('getBudgetLine', () => {
    let mockRow;

    beforeEach(() => {

        // Mock instance of Row.
        mockRow = new Row();
    });

    it('returns budget line number from description with bli=number', () => {
        mockRow.getCell.mockReturnValue({ value: 'bli=145 Cash payment for pancakes', });
        expect(getBudgetLine(mockRow)).toBe(145);
    });

    it('returns \'none\' from description with bli=none', () => {
        mockRow.getCell.mockReturnValue({ value: 'bli=none Baby bottle donation', });
        expect(getBudgetLine(mockRow)).toBe('none');
    });

    it('returns empty string from description without bli', () => {
        mockRow.getCell.mockReturnValue({ value: 'Baby bottle donation', });
        expect(getBudgetLine(mockRow)).toBe('');
    });
});