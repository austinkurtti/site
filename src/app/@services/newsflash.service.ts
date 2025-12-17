import { inject, Injectable, Injector, RendererFactory2, Type } from '@angular/core';
import { AppNewsflashDirective } from '@directives/newsflash/app-newsflash.directive';
import { NewsflashDirective } from '@directives/newsflash/newsflash.directive';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NewsflashService {
    public appNewsflashRef: AppNewsflashDirective;

    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    private _flashing = false;
    private _flashDuration = 5; // seconds
    private _instance: any;
    private _unlisteners = new Array<() => void>();

    private get _newsflashContainerEl(): HTMLElement {
        return this.appNewsflashRef.elementRef.nativeElement.parentElement;
    }

    private get _tabbableEls(): any {
        const tabbableSelectors = [
            'a:not([disabled])',
            'button:not([disabled])',
            'input:not([disabled])',
            '[tabindex]:not([disabled]):not([tabindex="-1"])'
        ];
        return this._newsflashContainerEl.querySelectorAll(tabbableSelectors.join(', '));
    }

    public initNewsflashFocus(): void {
        this._newsflashContainerEl.focus();
    }

    public show<T extends NewsflashDirective>(componentType: Type<T>, componentInputs?: object, injector?: Injector): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // Only one newsflash at a time
            if (this._flashing) {
                reject('A newsflash is already active');
            }

            this._flashing = true;

            // If a custom injector is provided, use it so newsflash components can resolve providers from their caller's injector
            const createOptions: any = {};
            if (injector) {
                createOptions.injector = injector;
            }
            const componentRef = this.appNewsflashRef.viewContainerRef.createComponent<T>(componentType, createOptions);
            this._instance = componentRef.instance;

            if (this._instance) {
                // Set component properties
                Object.keys(componentInputs).forEach(inputKey => {
                    componentRef.setInput(inputKey, componentInputs[inputKey]);
                });

                // Style core newsflash elements
                this._renderer.removeClass(this._newsflashContainerEl, 'd-none');
                this._renderer.addClass(this._instance.elementRef.nativeElement, 'newsflash-content');
                if (this._instance.staticContentEl()) {
                    this._renderer.addClass(this._instance.staticContentEl().nativeElement, 'newsflash-static-content');
                }
                if (this._instance.movingContentEl()) {
                    this._renderer.addClass(this._instance.movingContentEl().nativeElement, 'newsflash-moving-content');
                }

                // Impose a tab lock on the newsflash so users can't do other things while it's happening
                this._unlisteners.push(this._renderer.listen(this._newsflashContainerEl, 'keydown', this._checkTabLock));

                // Auto-close the newsflash after it's duration
                timer(this._flashDuration * 1000).pipe(take(1)).subscribe(() => {
                    this._close();
                    resolve();
                });
            } else {
                this._flashing = false;
                reject('Failed to create newsflash component');
            }
        });
    }

    private _close(): void {
        if (!this._flashing) {
            return;
        }

        this._renderer.addClass(this._newsflashContainerEl, 'd-none');
        this.appNewsflashRef.viewContainerRef.clear();
        this._unlisteners.forEach(unlisten => unlisten());
        this._unlisteners = [];
        this._flashing = false;
    }

    private _checkTabLock = (e: KeyboardEvent): void => {
        if (e.code === 'Tab' && this._tabbableEls.length) {
            if (e.shiftKey && (this._tabbableEls[0] === document.activeElement || this._newsflashContainerEl === document.activeElement)) {
                this._tabbableEls[this._tabbableEls.length - 1].focus();
                e.preventDefault();
            } else if (!e.shiftKey && this._tabbableEls[this._tabbableEls.length - 1] === document.activeElement) {
                this._tabbableEls[0].focus();
                e.preventDefault();
            }
        }
    };
}
