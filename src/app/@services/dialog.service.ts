import { Injectable, Renderer2, RendererFactory2, Type } from '@angular/core';
import { DialogDirective } from '@directives/dialog.directive';
import { IDialog } from '@interfaces/dialog.interface';
import { DialogSize } from '@models/dialog.model';

@Injectable()
export class DialogService {
    public dialogRef: DialogDirective;

    private _open = false;
    private _renderer: Renderer2;

    private get _dialogEl(): HTMLDialogElement {
        return this.dialogRef.elementRef.nativeElement.parentElement;
    }

    constructor(
        private _rendererFactory: RendererFactory2
    ) {
        this._renderer = _rendererFactory.createRenderer(null, null);
    }

    public show<T extends IDialog>(componentType: Type<T>, size: DialogSize): T {
        if (this._open) {
            return;
        }

        this._open = true;
        this._dialogEl.show();
        const instance = this.dialogRef.viewContainerRef.createComponent<T>(componentType).instance;

        if (instance?.elementRef) {
            this._renderer.addClass(this._dialogEl, this._getSizeClass(size));
            this._renderer.addClass(instance.elementRef.nativeElement, 'dialog-content');
            this._dialogEl.addEventListener('click', (e: MouseEvent) => this._closeOnOutsideClick(e, instance.elementRef.nativeElement));
        }

        return instance;
    }

    public close(): void {
        if (!this._open) {
            return;
        }

        this.dialogRef.viewContainerRef.clear();
        this._dialogEl.removeAllListeners('click');
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
