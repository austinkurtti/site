import { Directive, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[deferLoad]'
})
export class DeferLoadDirective implements AfterViewInit {
    @Input() threshold = 0;
    @Output() public onLoad: EventEmitter<any> = new EventEmitter<any>();

    private _intersectionObserver: IntersectionObserver;

    constructor(
        private _elementRef: ElementRef
    ) { }

    public ngAfterViewInit() {
        this._intersectionObserver = new IntersectionObserver(entries => {
            this._checkForIntersection(entries);
        }, {threshold: this.threshold});
        this._intersectionObserver.observe(<Element>(this._elementRef.nativeElement));
    }

    private _checkForIntersection = (entries: Array<IntersectionObserverEntry>): void => {
        entries.forEach(entry => {
            if (this._checkIfIntersecting(entry)) {
                this.onLoad.emit();
                this._intersectionObserver.unobserve(<Element>(this._elementRef.nativeElement));
                this._intersectionObserver.disconnect();
            }
        });
    }

    private _checkIfIntersecting = (entry: IntersectionObserverEntry): boolean => {
        return entry.isIntersecting && entry.target === this._elementRef.nativeElement;
    }
}
