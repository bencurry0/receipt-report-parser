/*
 * Copyright (c) 2024.   curryfirm.com
 */

import Constants from '../main/constants.js';

describe('Constants file', () => {
    it('should have correct values for SOURCE_POSITIONS', () => {
        const sourcePositions = Constants.SOURCE_POSITIONS;

        // Verify each value in SOURCE_POSITIONS
        expect(sourcePositions.BATCH_NUM).toBe(1);
        expect(sourcePositions.CHECK_NUM).toBe(2);
        expect(sourcePositions.BATCH_DATE).toBe(10);
        expect(sourcePositions.PAYOR).toBe(10);
        expect(sourcePositions.ACCOUNT).toBe(10);
        expect(sourcePositions.EVENT).toBe(15);
        expect(sourcePositions.BATCH_TOTAL_LABEL).toBe(17);
        expect(sourcePositions.DESCRIPTION).toBe(19);
        expect(sourcePositions.AMOUNT).toBe(26);
        expect(sourcePositions.BATCH_TOTAL).toBe(23);
    });

    it('should be immutable (using Object.freeze)', () => {
        // eslint-disable-next-line no-const-assign
        const sourcePositions = Constants.SOURCE_POSITIONS;

        // Try changing a constant value (it should not succeed since the object is frozen)
        expect(() => {
            sourcePositions.BATCH_NUM = 9; // Attempt to modify
        }).toThrow(); // This should throw an error in strict mode

        // Optionally, test other properties of Object.freeze
        expect(Object.isFrozen(Constants.SOURCE_POSITIONS)).toBe(true); // Check if the object is frozen
    });
});
