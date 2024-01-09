import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ak-career-item',
    styleUrls: ['./career-item.component.scss'],
    templateUrl: './career-item.component.html'
})
export class CareerItemComponent {
    @Input() name: string;
    @Input() timeframe: string;
    @Input() company: string;
    @Input() expanded: boolean;

    @Output() toggleExpanded = new EventEmitter<string>();

    private _id: string;

    constructor() {
        this._id = crypto.randomUUID().toString();
    }

    public get id(): string {
        return this._id;
    }
}
