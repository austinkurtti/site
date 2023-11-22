// eslint-disable-next-line id-blacklist
interface Number {
    hasFlag: (flag: number) => boolean;
    hasAllFlags: (flags: number) => boolean;
    toggleFlag: (flag: number) => number;
}

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
