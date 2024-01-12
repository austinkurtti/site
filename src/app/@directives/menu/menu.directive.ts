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
    selector: '[akMenu]'
})
export class MenuDirective {
    @Input() menuPosition: MenuPosition = MenuPosition.bottomLeft;
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
        const menuEl = menu.rootNodes[0];

        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        if (this.menuPosition.hasFlag(MenuPosition.top)) {
            this._renderer.setStyle(menuEl, 'bottom', `${window.innerHeight - hostRect.top}px`);
        } else if (this.menuPosition.hasFlag(MenuPosition.bottom)) {
            this._renderer.setStyle(menuEl, 'top', `${hostRect.bottom}px`);
        }
        if (this.menuPosition.hasFlag(MenuPosition.left)) {
            this._renderer.setStyle(menuEl, 'left', `${hostRect.left}px`);
        } else if (this.menuPosition.hasFlag(MenuPosition.right)) {
            this._renderer.setStyle(menuEl, 'right', `${window.innerWidth - hostRect.right}px`);
        }

        this._isOpen = true;
    };

    public close = (): void => {
        this._viewContainerRef.clear();
        this._isOpen = false;
    };
}
