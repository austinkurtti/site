/**
 * Random Number Generator Service
 *
 * Based off https://stackoverflow.com/a/47593316
 */
export class PRNGService {
    /**
     * Get a pseudorandom number generator (PRNG) that, when called, will return a number between 0 (inclusive) and 1 (exclusive).
     *
     * Accepts a seed string, which is used to prime a PRNG. If no seed is provided, the default `Math.random` generator will be returned.
     *
     * @param seed Value to seed PRNG
     * @returns Callable PRNG
     */
    public static random(seed = null): () => number {
        let generator = Math.random;
        if (seed) {
            const seedhash = this._cyrb128(seed);
            generator = this._sfc32(seedhash[0], seedhash[1], seedhash[2], seedhash[3]);
        }
        return generator;
    }

    /**
     * Hash function that provides seed components.
     *
     * @param seed Value to seed PRNG
     * @returns Array of four 32-bit seed components
     */
    private static _cyrb128(seed: string): number[] {
        let h1 = 1779033703;
        let h2 = 3144134277;
        let h3 = 1013904242;
        let h4 = 2773480762;

        for (let i = 0, k: number; i < seed.length; i++) {
            k = seed.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }

        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        h1 ^= (h2 ^ h3 ^ h4);
        h2 ^= h1;
        h3 ^= h1;
        h4 ^= h1;
        return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
    }

    /**
     * Simple Fast Counter
     *
     * Takes four 32-bit seed component hashes to generate pseudorandom numbers.
     *
     * @param a First seed hash
     * @param b Second seed hash
     * @param c Third seed hash
     * @param d Fourth seed hash
     * @returns Callable seeded PRNG
     */
    private static _sfc32(a: number, b: number, c: number, d: number): () => number {
        return () => {
            a |= 0;
            b |= 0;
            c |= 0;
            d |= 0;
            const t = (a + b | 0) + d | 0;

            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        };
    }
}
