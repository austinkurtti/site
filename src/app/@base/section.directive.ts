import { Directive, ChangeDetectorRef } from '@angular/core';
import { deferLoad } from '../@constants/strings';

@Directive()
export abstract class SectionDirective {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public abstract navigationId: string;

    constructor(
        protected _changeDetectorRef: ChangeDetectorRef
    ) {}

    public detectChangesSafely(): void {
        if (!this._changeDetectorRef['destroyed']) {
            this._changeDetectorRef.detectChanges();
        }
    }

    public deferLoad(): void {
        this.deferClass = deferLoad;
    }
}
