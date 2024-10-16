import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { baseSizePx } from '@constants/numbers';
import { BehaviorSubject } from 'rxjs';
import { CardModel, Rank, Suit } from './solitaire.models';

@Component({
    selector: 'ak-solitaire',
    styleUrls: ['./solitaire.component.scss'],
    templateUrl: './solitaire.component.html'
})
export class SolitaireComponent implements OnInit {
    public baseSizePx = baseSizePx;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public Suit = Suit;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public Rank = Rank;

    public time$ = new BehaviorSubject<string>('00:00:00');
    public score = 0;
    public moves = 0;

    public stock: CardModel[]; // facedown cards to be turned over
    public waste: CardModel[]; // faceup cards that can be played into foundations or piles
    public foundations: CardModel[][]; // final stacks of same-suit cards
    public tableaus: CardModel[][]; // facedown cards in lanes
    public piles: CardModel[][]; // faceup cards in lanes
    public dropListIds: string[];

    public ngOnInit(): void {
        this._reset();

        this.dropListIds = this.foundations.map((foundation, index) => `foundation-${index}`);
        this.dropListIds.push(...this.piles.map((pile, index) => `pile-${index}`));
    }

    public popStock(): void {
        if (this.stock.length) {
            this.waste.push(this.stock.pop());
        }
    }

    public resetStock(): void {
        if (this.waste.length) {
            this.stock = [...this.waste.reverse()];
            this.waste = [];
        }
    }

    public drop(event: CdkDragDrop<CardModel[]>): void {
        const dropCard = event.item.data as CardModel;
        const topCard = event.container.data[event.container.data.length - 1];

        if (!topCard && dropCard.rank === Rank.king) {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
            this._checkForNextFaceupCard(event);
        } else if (topCard && dropCard.rank === topCard.rank - 1 && this._isOppositeSuitColor(dropCard, topCard)) {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.container.data.length);
            this._checkForNextFaceupCard(event);
        } else if (event.container.id.startsWith('foundation')) {
            if (!event.container.data.length && dropCard.rank === Rank.ace) {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, 0);
                this._checkForNextFaceupCard(event);
            } else if (event.container.data.length &&
                event.container.data[0].suit === dropCard.suit &&
                event.container.data[event.container.data.length - 1].rank === dropCard.rank - 1
            ) {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.container.data.length);
                this._checkForNextFaceupCard(event);
            }
        }
    }

    // public sortPredicate(index: number, card: CdkDrag<CardModel>, container: CdkDropList<CardModel[]>): boolean {
    //     return index === container.data.length;
    // }

    private _reset(): void {
        // Generate full deck of 52 cards for stock
        this.stock = [];
        Object.values(Suit).filter(s => typeof s === 'number').forEach((s: number) => {
            Object.values(Rank).filter(r => typeof r === 'number').forEach((r: number) => {
                this.stock.push(new CardModel({
                    suit: s,
                    rank: r
                }));
            });
        });

        // Shuffle the stock
        // 1. Start at last card in stock
        // 2. Pick random card from array and swap with current card
        // 3. Move to next card
        // 4. Repeat 1-3 until first card reached
        for (let i = this.stock.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            [this.stock[i], this.stock[random]] = [this.stock[random], this.stock[i]];
        }

        // Clear all non-stock card stacks
        this.waste = [];
        // this.foundations = [
        //     new FoundationModel(),
        //     new FoundationModel(),
        //     new FoundationModel(),
        //     new FoundationModel()
        // ];
        this.foundations = [[], [], [], []];
        this.tableaus = [[], [], [], [], [], [], []];
        this.piles = [[], [], [], [], [], [], []];

        // Deal stock out to tableaus
        this.tableaus.forEach((tableau, index) => {
            for (let i = index; i >= 0; i--) {
                const card = this.stock.pop();
                card.facedown = i > 0;
                tableau.push(card);
            }
        });

        // Move top card from each tableau to corresponding pile
        this.piles.forEach((pile, index) => {
            pile.push(this.tableaus[index].pop());
        });
    }

    private _isOppositeSuitColor(firstCard: CardModel, secondCard: CardModel): boolean {
        let isOpposite = false;
        switch (firstCard.suit) {
            case Suit.heart:
            case Suit.diamond:
                isOpposite = secondCard.suit === Suit.club || secondCard.suit === Suit.spade;
                break;
            case Suit.club:
            case Suit.spade:
                isOpposite = secondCard.suit === Suit.heart || secondCard.suit === Suit.diamond;
        }

        return isOpposite;
    }

    private _checkForNextFaceupCard(event: CdkDragDrop<CardModel[]>): void {
        if (event.previousContainer.id !== 'waste') {
            const previousLaneIndex = parseInt(event.previousContainer.id.split('-')[1], 10);
            if (!event.previousContainer.data.length && this.tableaus[previousLaneIndex].length) {
                transferArrayItem(this.tableaus[previousLaneIndex], event.previousContainer.data, this.tableaus.length - 1, 0);
                event.previousContainer.data[0].facedown = false;
            }
        }
    }
}
