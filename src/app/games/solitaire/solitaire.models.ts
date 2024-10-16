export enum Suit {
    heart = 1,
    diamond = 2,
    club = 3,
    spade = 4
}

export enum Rank {
    ace = 1,
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    ten = 10,
    jack = 11,
    queen = 12,
    king = 13
}

export class CardModel {
    suit: Suit;
    rank: Rank;
    facedown: boolean;

    constructor(partial?: Partial<CardModel>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
