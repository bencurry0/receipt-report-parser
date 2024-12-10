/*
 * Copyright (c) 2024.   curryfirm.com
 */

import CONSTANTS from '../main/constants.js';

describe('Constants file', () => {
    it('should have correct values for SOURCE_POSITIONS', () => {
        const sourcePositions = CONSTANTS.SOURCE_POSITIONS;

        // Verify each value in SOURCE_POSITIONS
        expect(sourcePositions.BATCH_NUM).toBe(2);
        expect(sourcePositions.CHECK_NUM).toBe(3);
        expect(sourcePositions.BATCH_DATE).toBe(11);
        expect(sourcePositions.PAYOR).toBe(11);
        expect(sourcePositions.ACCOUNT).toBe(11);
        expect(sourcePositions.EVENT).toBe(16);
        expect(sourcePositions.BATCH_TOTAL_LABEL).toBe(18);
        expect(sourcePositions.DESCRIPTION).toBe(20);
        expect(sourcePositions.AMOUNT).toBe(27);
        expect(sourcePositions.BATCH_TOTAL).toBe(24);
    });

    it('should be immutable (using Object.freeze)', () => {
        // eslint-disable-next-line no-const-assign
        const sourcePositions = CONSTANTS.SOURCE_POSITIONS;

        // Try changing a constant value (it should not succeed since the object is frozen)
        expect(() => {
            sourcePositions.BATCH_NUM = 10; // Attempt to modify
        }).toThrow(); // This should throw an error in strict mode

        // Optionally, test other properties of Object.freeze
        expect(Object.isFrozen(CONSTANTS.SOURCE_POSITIONS)).toBe(true); // Check if the object is frozen
    });
});
