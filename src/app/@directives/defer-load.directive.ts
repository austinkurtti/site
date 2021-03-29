import { Directive, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[akDeferLoad]'
})
export class DeferLoadDirective implements AfterViewInit {
    @Input() threshold = 0;

    @Output() public deferLoad: EventEmitter<any> = new EventEmitter<any>();

    private _intersectionObserver: IntersectionObserver;

    constructor(
        private _elementRef: ElementRef
    ) { }

    public ngAfterViewInit() {
        this._intersectionObserver = new IntersectionObserver(entries => {
            this._checkForIntersection(entries);
        }, {threshold: this.threshold});
        this._intersectionObserver.observe(this._elementRef.nativeElement as Element);
    }

    private _checkForIntersection(entries: Array<IntersectionObserverEntry>): void {
        entries.forEach(entry => {
            if (this._checkIfIntersecting(entry)) {
                this.deferLoad.emit();
                this._intersectionObserver.unobserve(this._elementRef.nativeElement as Element);
                this._intersectionObserver.disconnect();
            }
        });
    }

    private _checkIfIntersecting = (entry: IntersectionObserverEntry): boolean => entry.isIntersecting && (entry.target === this._elementRef.nativeElement);
}
