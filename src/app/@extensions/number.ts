// eslint-disable-next-line id-blacklist
interface Number {
    bounded: (min: number, max: number) => number;
    hasFlag: (flag: number) => boolean;
    hasAllFlags: (flags: number) => boolean;
    toggleFlag: (flag: number) => number;
}

Number.prototype.bounded = function(min: number, max: number): number {
    let value = this;
    if (this < min) {
        value = min;
    } else if (this > max) {
        value = max;
    }
    return value;
};

Number.prototype.hasFlag = function(flag: number): boolean {
    return (this & flag) !== 0;
};

Number.prototype.hasAllFlags = function(flags: number): boolean {
    return (this & flags) === flags;
};

Number.prototype.toggleFlag = function(flag: number): number {
    return this.hasFlag(flag)
        ? this & ~flag
        : this | flag;
};
