import { Component, OnInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';

@Component({})
export class BaseComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';
    public colorClass = '';
    public colorClassLight = '';
    public colorClassDark = '';

    constructor(
        protected _colorService: ColorService
    ) {}

    public ngOnInit() {
        this.colorClass = this._colorService.getRandomColorClass();
        this.colorClassLight = this.colorClass + '-light';
        this.colorClassDark = this.colorClass + '-dark';
    }
}
