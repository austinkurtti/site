import { ContentChild, Directive, ElementRef, HostBinding, HostListener, Input, Renderer2, TemplateRef, ViewContainerRef, inject } from '@angular/core';

export enum MenuPosition {
    top             = 1 << 0,
    right           = 1 << 1,
    bottom          = 1 << 2,
    left            = 1 << 3,
    topLeft         = top | left,
    topRight        = top | right,
    bottomLeft      = bottom | left,
    bottomRight     = bottom | right
}

@Directive({
    selector: '[akMenu]',
    standalone: false
})
export class MenuDirective {
    @Input() menuPosition: MenuPosition = MenuPosition.bottomRight;
    @ContentChild('menuContent') menuContent: TemplateRef<any>;

    @HostBinding('attr.tabindex') tabindex = 0;
    @HostBinding('class') classes = 'menu-host';

    private _elementRef = inject(ElementRef);
    private _viewContainerRef = inject(ViewContainerRef);
    private _renderer = inject(Renderer2);

    private _isOpen = false;

    @HostListener('click', ['$event']) hostClick(event: PointerEvent): void {
        event.stopPropagation();
        (this._isOpen ? this.close : this.open)();
    }

    public open = (): void => {
        const menu = this._viewContainerRef.createEmbeddedView(this.menuContent);
        // Give menu components a complete cycle to settle their views and bindings before calculating positioning
        menu.detectChanges();

        const menuEl = menu.rootNodes[0];
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        if (this.menuPosition.hasFlag(MenuPosition.top)) {
            if ((document.body.clientHeight - hostRect.top + menuEl.clientHeight) > document.body.clientHeight) {
                this._positionBottom(menuEl, hostRect);
            } else {
                this._positionTop(menuEl, hostRect);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.bottom)) {
            if ((hostRect.bottom + menuEl.clientHeight) > document.body.clientHeight) {
                this._positionTop(menuEl, hostRect);
            } else {
                this._positionBottom(menuEl, hostRect);
            }
        }
        if (this.menuPosition.hasFlag(MenuPosition.right)) {
            if ((hostRect.left + menuEl.clientWidth) > document.body.clientWidth) {
                this._positionLeft(menuEl, hostRect);
            } else {
                this._positionRight(menuEl, hostRect);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.left)) {
            if ((document.body.clientWidth - hostRect.right + menuEl.clientWidth) > document.body.clientWidth) {
                this._positionRight(menuEl, hostRect);
            } else {
                this._positionLeft(menuEl, hostRect);
            }
        }

        this._isOpen = true;
    };

    public close = (): void => {
        this._viewContainerRef.clear();
        this._isOpen = false;
    };

    private _positionTop(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'bottom', `${document.body.clientHeight - hostRect.top}px`);
    }

    private _positionRight(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'left', `${hostRect.left}px`);
    }

    private _positionBottom(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'top', `${hostRect.bottom}px`);
    }

    private _positionLeft(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'right', `${document.body.clientWidth - hostRect.right}px`);
    }
}
