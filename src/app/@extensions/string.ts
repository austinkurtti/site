// eslint-disable-next-line id-blacklist
interface String {
    trimLeftChars: (chars: string[]) => string;
}

String.prototype.trimLeftChars = function(chars: string[]): string {
    let str = this;
    while (chars.includes(str.charAt(0))) {
        str = str.substring(1);
    }
    return str;
};
