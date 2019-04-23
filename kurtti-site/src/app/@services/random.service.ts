import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RandomService {
    // Based off $class-colors in src/style-paths/_variables.scss
    private _fullNumberPool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    private _numberPool = [];

    /**
     * Resets the available number pool.
     * 
     * @returns {void}
     * @memberof RandomService
     */
    public resetNumberPool = (): void => {
        this._numberPool = [...this._fullNumberPool];
    }

    /**
     * Generates a random color class based on available number pool minus any excluded numbers.
     * 
     * @param {Array<number>} excludeNums Array of numbers to exclude from generation
     * @returns {string} Generated color class
     * @memberof RandomService
     */
    public getRandomColorClass = (excludeNums: Array<number> = []): string => {
        // Get available numbers from which to generate the color class
        const nums = [...this._numberPool].filter(num => {
            return !excludeNums.includes(num);
        });

        // Select a random number from the resulting pool
        const random = nums[(Math.random() * nums.length | 0)];

        // Remove the selected random from the available number pool to avoid duplicates
        this._numberPool = this._numberPool.filter((num, i) => {
            return random !== this._numberPool[i];
        });

        return `color-${random}`;
    }
}
