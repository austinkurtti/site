import { Component, OnInit } from '@angular/core';
import { baseSizePx } from '@constants/numbers';
import { CardModel, Suit, Rank, FoundationModel } from './solitaire.models';

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

    public time = 0;
    public score = 0;
    public moves = 0;

    public stock: Array<CardModel>;
    public talon: Array<CardModel>;
    public foundations: Array<FoundationModel>;
    public tableaus: Array<Array<CardModel>>;

    public ngOnInit(): void {
        this._reset();
    }

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

        // Clear other piles
        this.talon = [];
        this.foundations = [
            new FoundationModel(),
            new FoundationModel(),
            new FoundationModel(),
            new FoundationModel()
        ];
        this.tableaus = [[], [], [], [], [], [], []];

        // Deal stock out to tableaus
        this.tableaus.forEach((tableau, index) => {
            for (let i = index; i >= 0; i--) {
                const card = this.stock.pop();
                card.facedown = i > 0;
                tableau.push(card);
            }
        });
    }
}
