/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getBudgetLine } from '../main/getCellValue.js';

describe('getBudgetLine', () => {
    let row;

    beforeEach(() => {

        // Mock row and getCell.
        row = {
            getCell: jest.fn(),
        };
    });

    it('returns budget line number from description with bli=number', () => {
        row.getCell.mockReturnValue('bli=145 Cash payment for pancakes');
        expect(getBudgetLine(row)).toBe(145);
    });

    it('returns \'none\' from description with bli=none', () => {
        row.getCell.mockReturnValue('bli=none Baby bottle donation');
        expect(getBudgetLine(row)).toBe('none');
    });

    it('returns empty string from description without bli', () => {
        row.getCell.mockReturnValue('Baby bottle donation');
        expect(getBudgetLine(row)).toBe('');
    });
});