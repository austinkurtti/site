import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    // Based off $class-colors in src/style-paths/_variables.scss
    private _fullNumberPool = [1, 2, 3, 4];
    private _numberPool = [];

    public resetNumberPool = (): void => {
        this._numberPool = [...this._fullNumberPool];
    }

    public getRandomColorClass = (excludeNums: Array<number> = []): string => {
        if (!this._numberPool.length || this._numberPool.length <= excludeNums.length) {
            this.resetNumberPool();
        }

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
