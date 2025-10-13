import { Injectable, Injector, RendererFactory2, Type, inject } from '@angular/core';
import { DialogBaseDirective } from '@directives/dialog/dialog-base.directive';
import { DialogDirective } from '@directives/dialog/dialog.directive';
import { DialogSize } from '@models/dialog.model';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    public dialogRef: DialogDirective;

    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    private _open = false;
    private _openSize: DialogSize;
    private _instance: any;
    private _unlisteners = new Array<() => void>();

    private get _dialogEl(): HTMLDialogElement {
        return this.dialogRef.elementRef.nativeElement.parentElement;
    }

    private get _tabbableEls(): any {
        const tabbableSelectors = [
            'a:not([disabled])',
            'button:not([disabled])',
            'input:not([disabled])',
            '[tabindex]:not([disabled]):not([tabindex="-1"])'
        ];
        return this._dialogEl.querySelectorAll(tabbableSelectors.join(', '));
    }

    public show<T extends DialogBaseDirective>(componentType: Type<T>, size: DialogSize, allowSoftClose = true, injector?: Injector): T {
        // I refuse to allow more than one dialog open at once
        if (this._open) {
            return null;
        }

        this._open = true;
        this._openSize = size;
        this._dialogEl.show();

        // If a custom injector is provided, use it so dialog components can resolve providers from their caller's injector
        const createOptions: any = {};
        if (injector) {
            createOptions.injector = injector;
        }
        this._instance = this.dialogRef.viewContainerRef.createComponent<T>(componentType, createOptions).instance;

        if (this._instance) {
            // Style dialog
            this._renderer.addClass(this._dialogEl, this._getSizeClass(size));
            this._renderer.addClass(this._instance.elementRef.nativeElement, 'dialog-content');

            // Impose a tab lock on the dialog
            this._unlisteners.push(this._renderer.listen(this._dialogEl, 'keydown', this._checkTabLock));

            // Conditionally allow dialog to be closed on an outside click or escape key
            if (allowSoftClose) {
                this._unlisteners.push(this._renderer.listen(this._dialogEl, 'click', this._checkOutsideClick));
                this._unlisteners.push(this._renderer.listen(this._dialogEl, 'keydown', this._checkEscape));
            }
        }

        return this._instance;
    }

    public close(): void {
        if (!this._open) {
            return;
        }

        this._instance.closeCallback?.();
        this.dialogRef.viewContainerRef.clear();
        this._unlisteners.forEach(unlisten => unlisten());
        this._unlisteners = [];
        this._renderer.removeClass(this._dialogEl, this._getSizeClass(this._openSize));
        this._dialogEl.close();
        this._open = false;
    }

    public initDialogFocus(): void {
        this._dialogEl.focus();
    }

    private _getSizeClass = (size: DialogSize): string => Object.keys(DialogSize).find(key => DialogSize[key] === size);

    private _checkTabLock = (e: KeyboardEvent): void => {
        if (e.code === 'Tab' && this._tabbableEls.length) {
            if (e.shiftKey && (this._tabbableEls[0] === document.activeElement || this._dialogEl === document.activeElement)) {
                this._tabbableEls[this._tabbableEls.length - 1].focus();
                e.preventDefault();
            } else if (!e.shiftKey && this._tabbableEls[this._tabbableEls.length - 1] === document.activeElement) {
                this._tabbableEls[0].focus();
                e.preventDefault();
            }
        }
    };

    private _checkOutsideClick = (e: MouseEvent): void => {
        const dialogBounds = this._instance.elementRef.nativeElement.getBoundingClientRect();
        if (e.clientX < dialogBounds.left || e.clientX > dialogBounds.right || e.clientY < dialogBounds.top || e.clientY > dialogBounds.bottom) {
            this.close();
        }
    };

    private _checkEscape = (e: KeyboardEvent): void => {
        if (e.code === 'Escape') {
            this.close();
        }
    };
}
