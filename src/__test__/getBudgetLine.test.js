/*
 * Copyright (c) 2024.   curryfirm.com
 */

import { getBudgetLine } from '../main/getCellValue.js';

const DESC_ROW_WITH_BLI = ',,113,,,,,,,,General,,,,,PancakeBreakfast,,,,bli=28 blah blah,,,,,,,35.00'.split(',');
const DESC_ROW_WITH_BLI_NONE = ',,113,,,,,,,,General,,,,,PancakeBreakfast,,,,bli=none blah blah,,,,,,,35.00'.split(',');
const DESC_NO_BLI = ',,113,,,,,,,,General,,,,,PancakeBreakfast,,,,blah blah,,,,,,,35.00'.split(',');

describe('getBudgetLine', () => {

    it('returns budget line number from description with bli=number', () => {
        expect(getBudgetLine(DESC_ROW_WITH_BLI)).toBe(28);
    });

    it('returns \'none\' from description with bli=none', () => {
        expect(getBudgetLine(DESC_ROW_WITH_BLI_NONE)).toBe('none');
    });

    it('returns empty string from description without bli', () => {
        expect(getBudgetLine(DESC_NO_BLI)).toBe('');
    });
});