import { Component, ContentChild, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'ak-career-item',
    styleUrls: ['./career-item.component.scss'],
    templateUrl: './career-item.component.html',
    standalone: false
})
export class CareerItemComponent {
    @Input() name: string;
    @Input() timeframe: string;
    @Input() company: string;
    @Input() expanded: boolean;

    @Output() toggleExpanded = new EventEmitter<string>();

    @ContentChild('badgeTemplate') badgeTemplate: TemplateRef<any>;
    @ContentChild('contentTemplate') contentTemplate: TemplateRef<any>;

    private _id: string;

    constructor() {
        this._id = crypto.randomUUID().toString();
    }

    @HostBinding('class.expanded') get expandedClass() {
        return this.expanded;
    }

    public get id(): string {
        return this._id;
    }
}
