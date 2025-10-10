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

export enum MenuWidth {
    auto            = 'auto',
    full            = '100%',
    threeQuarters   = '75%',
    half            = '50%',
    third           = '33.33%',
    quarter         = '25%'
}

@Directive({ selector: '[akMenu]' })
export class MenuDirective {
    @Input() menuPosition: MenuPosition = MenuPosition.bottomRight;
    @Input() menuWidth: MenuWidth = MenuWidth.auto;
    @ContentChild('menuContent') menuContent: TemplateRef<any>;

    @HostBinding('attr.tabindex') tabindex = 0;
    @HostBinding('class') classes = 'menu-host';

    private _elementRef = inject(ElementRef);
    private _viewContainerRef = inject(ViewContainerRef);
    private _renderer = inject(Renderer2);

    private _isOpen = false;

    @HostListener('click', ['$event']) hostClick(event: PointerEvent): void {
        if (this._isOpen) {
            this.close();
        } else {
            // Only open the menu after the entire click event loop finishes
            // menu-content.directive attaches it's _outsideClickListener to the document, which will execute last in the event
            // This allows any currently open menu to close first and prevents the view from jolting around as menus simultaneiously calcuate their sizes
            setTimeout(() => {
                this.open();
            }, 0);
        }
    }

    public open = (): void => {
        const menu = this._viewContainerRef.createEmbeddedView(this.menuContent);
        // Give menu components a complete cycle to settle their views and bindings before calculating positioning
        menu.detectChanges();

        // Size the menu - this must be done before positioning
        const menuEl = menu.rootNodes[0];
        this._renderer.setStyle(menuEl, 'width', this.menuWidth);

        // Position the menu
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        if (this.menuPosition.hasFlag(MenuPosition.top)) {
            if (menuEl.clientHeight > hostRect.top) {
                this._positionBottom(menuEl, hostRect);
            } else {
                this._positionTop(menuEl, hostRect);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.bottom)) {
            if (menuEl.clientHeight > (document.body.clientHeight - hostRect.bottom)) {
                this._positionTop(menuEl, hostRect);
            } else {
                this._positionBottom(menuEl, hostRect);
            }
        }
        if (this.menuPosition.hasFlag(MenuPosition.right)) {
            if (menuEl.clientWidth > hostRect.right) {
                this._positionLeft(menuEl, hostRect);
            } else {
                this._positionRight(menuEl, hostRect);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.left)) {
            if (menuEl.clientWidth > (document.body.clientWidth - hostRect.left)) {
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

    public containsEventTarget = (target: EventTarget): boolean => this._elementRef.nativeElement.contains(target);

    private _positionTop(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'bottom', `${document.body.clientHeight - hostRect.top}px`);
    }

    private _positionRight(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'right', `${document.body.clientWidth - hostRect.right}px`);
    }

    private _positionBottom(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'top', `${hostRect.bottom}px`);
    }

    private _positionLeft(menuEl: any, hostRect: any): void {
        this._renderer.setStyle(menuEl, 'left', `${hostRect.left}px`);
    }
}
