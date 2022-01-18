import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { baseSizePx } from '../@constants/numbers';

@Directive({
    selector: '[akTooltip]'
})
export class TooltipDirective implements OnDestroy {
    @Input() tooltipContent: string;
    @Input() tooltipDelay = 500;

    private _tooltipEl: HTMLDivElement = null;
    private _debounceSubscription: Subscription;
    private get _tooltipContainerEl(): HTMLDivElement {
        return document.querySelector('.ak-tooltip-container');
    }

    constructor(
        private _hostElement: ElementRef,
        private _renderer: Renderer2
    ) {}

    // Show events
    @HostListener('mouseover', ['$event'])
    mouseover($event) {
        this._showTooltip();
    }

    @HostListener('focus', ['$event'])
    focus($event) {
        this._showTooltip();
    }

    // Hide events
    @HostListener('mouseout', ['$event'])
    mouseout($event) {
        this._hideTooltip();
    }

    @HostListener('blur', ['$event'])
    blur($event) {
        this._hideTooltip();
    }

    @HostListener('scroll', ['$event'])
    scroll($event) {
        this._hideTooltip();
    }

    public ngOnDestroy(): void {
        this._hideTooltip();
    }

    private _showTooltip(): void {
        this._debounceSubscription = timer(this.tooltipDelay).subscribe(() => {
            // Create the tooltip element
            this._tooltipEl = this._renderer.createElement('div');
            this._tooltipEl.innerHTML = this.tooltipContent;
            this._renderer.addClass(this._tooltipEl, 'ak-tooltip');

            // Render the tooltip by appending it now, that way it's rendered size can be used to better position it
            this._renderer.appendChild(this._tooltipContainerEl, this._tooltipEl);

            // Position tooltip relative to the host element
            const hostRect = this._hostElement.nativeElement.getBoundingClientRect();
            this._renderer.setStyle(this._tooltipEl, 'top', `${hostRect.y - (baseSizePx) - (this._tooltipEl.clientHeight)}px`);
            this._renderer.setStyle(this._tooltipEl, 'left', `${hostRect.x + (hostRect.width / 2) - (this._tooltipEl.clientWidth / 2)}px`);
        });
    }

    private _hideTooltip(): void {
        if (this._tooltipEl) {
            this._renderer.removeChild(this._tooltipContainerEl, this._tooltipEl);
            this._tooltipEl = null;
        } else {
            this._debounceSubscription?.unsubscribe();
        }
    }
}
