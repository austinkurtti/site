import { OnInit, HostListener, Directive, ChangeDetectorRef } from '@angular/core';
import { ColorService } from '@singletons/color.service';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseComponent implements OnInit {
    public deferThreshold = .4;
    public backgroundDeferClass = '';
    public contentDeferClass = 'invisible';
    public colorClass = '';
    public colorClassLight = '';
    public colorClassDark = '';
    public title = '';

    constructor(
        protected _colorService: ColorService,
        protected _changeDetectorRef: ChangeDetectorRef
    ) {}

    @HostListener('window:resize') onResize = () => {
        this.windowResized();
    };

    public ngOnInit() {
        this.colorClass = this._colorService.getRandomColorClass();
        this.colorClassLight = this.colorClass + '-light';
        this.colorClassDark = this.colorClass + '-dark';
    }

    public detectChangesSafely(): void {
        if (!this._changeDetectorRef['destroyed']) {
            this._changeDetectorRef.detectChanges();
        }
    }

    protected abstract windowResized(): void;
}
