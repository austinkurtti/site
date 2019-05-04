import { Component, OnInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { filter } from 'rxjs/operators';

@Component({})
export abstract class BaseComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';
    public colorClass = '';
    public colorClassLight = '';
    public colorClassDark = '';
    public title = '';

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService
    ) {}

    public ngOnInit() {
        this.colorClass = this._colorService.getRandomColorClass();
        this.colorClassLight = this.colorClass + '-light';
        this.colorClassDark = this.colorClass + '-dark';
        this._secretService.secretActivated$
            .pipe(filter(x => x))
            .subscribe(() => this.secretActivated());
    }

    protected abstract secretActivated(): void;
}
