import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RandomService {
    /**
     * Returns a number between the given min and max.
     * 
     * @param {number} min Defaults to 1
     * @param {number} max Defaults to 5
     * @returns {string}
     */
    public getRandomColorClass = (min: number = 1, max: number = 5): string => {
        const random = (Math.random() * max | 0) + min;
        return `color-${random}`;
    }
}