import { ContentChild, Directive, ElementRef, HostListener, Input, Renderer2, TemplateRef, ViewContainerRef, computed, inject, output, signal } from '@angular/core';

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

@Directive({
    selector: '[akMenu]',
    exportAs: 'akMenu',
    host: {
        'tabindex': '0',
        'class': 'menu-host'
    }
})
export class MenuDirective {
    @Input() menuPosition: MenuPosition = MenuPosition.bottomRight;
    @Input() menuWidth: MenuWidth = MenuWidth.auto;
    @ContentChild('menuContent') menuContent: TemplateRef<any>;

    public isOpenChanged = output<boolean>();

    public isOpen = computed(() => this._isOpen());

    private _elementRef = inject(ElementRef);
    private _viewContainerRef = inject(ViewContainerRef);
    private _renderer = inject(Renderer2);

    private _isOpen = signal(false);

    @HostListener('click', ['$event'])
    @HostListener('keydown', ['$event'])
    hostClick(event: KeyboardEvent | PointerEvent): void {
        if (this._isOpen()) {
            this.close();
        } else {
            // Only open the menu after the entire click event loop finishes
            // menu-content.directive attaches it's _outsideClickListener to the document, which will execute last in the event
            // This allows any currently open menu to close first and prevents the view from jolting around as menus simultaneously calcuate their sizes
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
                this._positionBottom(menuEl);
            } else {
                this._positionTop(menuEl);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.bottom)) {
            if (menuEl.clientHeight > (document.body.clientHeight - hostRect.bottom)) {
                this._positionTop(menuEl);
            } else {
                this._positionBottom(menuEl);
            }
        }
        if (this.menuPosition.hasFlag(MenuPosition.right)) {
            if (menuEl.clientWidth > hostRect.right) {
                this._positionLeft(menuEl);
            } else {
                this._positionRight(menuEl);
            }
        } else if (this.menuPosition.hasFlag(MenuPosition.left)) {
            if (menuEl.clientWidth > (document.body.clientWidth - hostRect.left)) {
                this._positionRight(menuEl);
            } else {
                this._positionLeft(menuEl);
            }
        }

        this._isOpen.set(true);
        this.isOpenChanged.emit(this.isOpen());
    };

    public close = (): void => {
        this._viewContainerRef.clear();
        this._isOpen.set(false);
        this.isOpenChanged.emit(this.isOpen());
    };

    public containsEventTarget = (target: EventTarget): boolean => this._elementRef.nativeElement.contains(target);

    /**
     * ! IMPORTANT
     * In the below _position* methods, hostRect is retrieved right before positioning to get the
     * most up-to-date bounding client rectangle. Otherwise, any previous positioning that has been
     * performed may skew the viewport slightly and affect the height/width of the host element.
     */

    private _positionTop(menuEl: any): void {
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        this._renderer.setStyle(menuEl, 'top', `${hostRect.top - menuEl.clientHeight}px`);
    }

    private _positionRight(menuEl: any): void {
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        this._renderer.setStyle(menuEl, 'left', `${hostRect.x + hostRect.width - menuEl.clientWidth}px`);
    }

    private _positionBottom(menuEl: any): void {
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        this._renderer.setStyle(menuEl, 'top', `${hostRect.bottom}px`);
    }

    private _positionLeft(menuEl: any): void {
        const hostRect = this._elementRef.nativeElement.getBoundingClientRect();
        this._renderer.setStyle(menuEl, 'left', `${hostRect.left}px`);
    }
}
