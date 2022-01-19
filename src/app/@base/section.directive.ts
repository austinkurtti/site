import { Directive, ChangeDetectorRef } from '@angular/core';
import { deferLoadComplete } from '../@constants/strings';

@Directive()
export abstract class SectionDirective {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public abstract title: string;
    public abstract titleColor: string;

    constructor(
        protected _changeDetectorRef: ChangeDetectorRef
    ) {}

    public detectChangesSafely(): void {
        if (!this._changeDetectorRef['destroyed']) {
            this._changeDetectorRef.detectChanges();
        }
    }

    public deferLoad(): void {
        this.deferClass = deferLoadComplete;
    }
}
