import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, Input, Output, inject } from '@angular/core';

@Directive({ selector: '[akDeferLoad]' })
export class DeferLoadDirective implements AfterViewInit {
    @Input() public threshold = 0;

    @Output() public deferLoad: EventEmitter<any> = new EventEmitter<any>();

    @HostBinding('class.deferred') private _deferredClass = true;

    public elementRef = inject(ElementRef);

    private _intersectionObserver: IntersectionObserver;

    public ngAfterViewInit() {
        this._intersectionObserver = new IntersectionObserver(entries => {
            this._checkForIntersection(entries);
        }, {threshold: this.threshold});
        this._intersectionObserver.observe(this.elementRef.nativeElement as Element);
    }

    private _checkForIntersection(entries: Array<IntersectionObserverEntry>): void {
        entries.forEach(entry => {
            if (this._checkIfIntersecting(entry)) {
                this.deferLoad.emit();
                this._intersectionObserver.unobserve(this.elementRef.nativeElement as Element);
                this._intersectionObserver.disconnect();
            }
        });
    }

    private _checkIfIntersecting = (entry: IntersectionObserverEntry): boolean => entry.isIntersecting && (entry.target === this.elementRef.nativeElement);
}
