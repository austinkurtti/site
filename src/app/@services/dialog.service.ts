import { Injectable, RendererFactory2, Type, inject } from '@angular/core';
import { DialogBase } from '@directives/dialog/dialog-base';
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

    private get _dialogEl(): HTMLDialogElement {
        return this.dialogRef.elementRef.nativeElement.parentElement;
    }

    public show<T extends DialogBase>(componentType: Type<T>, size: DialogSize, allowCloseOnOutsideClick = true): T {
        // I refuse to allow more than one dialog open at once
        if (this._open) {
            return;
        }

        this._open = true;
        this._openSize = size;
        this._dialogEl.show();
        this._instance = this.dialogRef.viewContainerRef.createComponent<T>(componentType).instance;

        if (this._instance) {
            this._renderer.addClass(this._dialogEl, this._getSizeClass(size));
            this._renderer.addClass(this._instance.elementRef.nativeElement, 'dialog-content');
            if (allowCloseOnOutsideClick) {
                this._dialogEl.addEventListener('click', (e: MouseEvent) => this._closeOnOutsideClick(e, this._instance.elementRef.nativeElement));
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
        this._dialogEl.removeAllListeners('click');
        this._renderer.removeClass(this._dialogEl, this._getSizeClass(this._openSize));
        this._dialogEl.close();
        this._open = false;
    }

    private _getSizeClass = (size: DialogSize): string => Object.keys(DialogSize).find(key => DialogSize[key] === size);

    private _closeOnOutsideClick = (e: MouseEvent, instanceEl: HTMLElement): void => {
        const dialogBounds = instanceEl.getBoundingClientRect();
        if (e.clientX < dialogBounds.left || e.clientX > dialogBounds.right || e.clientY < dialogBounds.top || e.clientY > dialogBounds.bottom) {
            this.close();
        }
    };
}
