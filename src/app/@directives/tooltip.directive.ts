import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { baseSizePx } from '../@constants/numbers';

@Directive({
    selector: '[akTooltip]'
})
export class TooltipDirective implements OnDestroy {
    @Input() tooltipContent: string;
    @Input() tooltipDelay = 500;
    @Input() tooltipPosition: 'top' | 'right' = 'top'; // TODO - enum this and add left/bottom

    private _tooltipEl: HTMLDivElement = null;
    private _unlisteners: Array<() => void> = [];
    private _debounceSubscription: Subscription;
    private get _tooltipContainerEl(): HTMLDivElement {
        return document.querySelector('#ak-tooltip-container');
    }

    constructor(
        private _hostElement: ElementRef,
        private _renderer: Renderer2
    ) {}

    @HostListener('mouseover')
    mouseover() {
        this._showTooltip();
    }

    @HostListener('focus')
    focus() {
        this._showTooltip();
    }

    public ngOnDestroy(): void {
        this._hideTooltip();
    }

    private _showTooltip(): void {
        // Prevent duplicate tooltips
        if (this._debounceSubscription) {
            return;
        }

        this._debounceSubscription = timer(this.tooltipDelay).subscribe(() => {
            // Create the tooltip element
            this._tooltipEl = this._renderer.createElement('div');
            this._tooltipEl.innerHTML = this.tooltipContent;
            this._renderer.addClass(this._tooltipEl, 'ak-tooltip');

            // Render the tooltip by appending it now, that way it's rendered size can be used to better position it
            this._renderer.appendChild(this._tooltipContainerEl, this._tooltipEl);

            // TODO - add logic for repositioning if going off-screen
            // Position tooltip relative to the host element
            const hostRect = this._hostElement.nativeElement.getBoundingClientRect();
            if (this.tooltipPosition === 'top') {
                this._renderer.addClass(this._tooltipEl, 'top');
                this._renderer.setStyle(this._tooltipEl, 'top', `${hostRect.y - baseSizePx - this._tooltipEl.clientHeight}px`);
                this._renderer.setStyle(this._tooltipEl, 'left', `${hostRect.x + (hostRect.width / 2) - (this._tooltipEl.clientWidth / 2)}px`);
            } else if (this.tooltipPosition === 'right') {
                this._renderer.addClass(this._tooltipEl, 'right');
                this._renderer.setStyle(this._tooltipEl, 'top', `${hostRect.y + (hostRect.height / 2) - (this._tooltipEl.clientHeight / 2)}px`);
                this._renderer.setStyle(this._tooltipEl, 'left', `${hostRect.x + hostRect.width + baseSizePx}px`);
            }

            // Hide the tooltip once one of the hide events triggers
            this._hideListen();
        });

        // If there is a tooltipDelay, don't show the tooltip if any of the hide events trigger before the debounce finishes
        if (this.tooltipDelay > 0) {
            this._hideListen();
        }
    }

    private _hideTooltip = (): void => {
        if (this._tooltipEl) {
            this._renderer.removeChild(this._tooltipContainerEl, this._tooltipEl);
            this._tooltipEl = null;
        }

        this._hideUnlisten();
        this._debounceSubscription?.unsubscribe();
        this._debounceSubscription = null;
    };

    private _hideListen(): void {
        this._unlisteners.push(this._renderer.listen(this._hostElement.nativeElement, 'mouseout', this._hideTooltip));
        this._unlisteners.push(this._renderer.listen(this._hostElement.nativeElement, 'blur', this._hideTooltip));
        document.addEventListener('scroll', this._hideTooltip);
        window.addEventListener('resize', this._hideTooltip);
    }

    private _hideUnlisten(): void {
        this._unlisteners.forEach(unlistener => unlistener());
        document.removeEventListener('scroll', this._hideTooltip);
        window.removeEventListener('resize', this._hideTooltip);
    }
}
