import { Directive, ElementRef, HostBinding, OnDestroy, OnInit, inject } from '@angular/core';
import { MenuDirective } from './menu.directive';

@Directive({ selector: '[akMenuContent]' })
export class MenuContentDirective implements OnInit, OnDestroy {
    @HostBinding('attr.role') role = 'menu';

    public menu = inject(MenuDirective);

    private _elementRef = inject(ElementRef);

    public ngOnInit(): void {
        document.addEventListener('click', this._documentClickListener);
        this._elementRef.nativeElement.addEventListener('focusin', this._focusInListener);
    }

    public ngOnDestroy(): void {
        document.removeEventListener('click', this._documentClickListener);
        this._elementRef.nativeElement.removeEventListener('focusin', this._focusInListener);
        this._elementRef.nativeElement.removeEventListener('focusout', this._focusOutListener);
    }

    private _documentClickListener = (event: PointerEvent): void => {
        // Any click after a menu is opened should result in the menu closing
        this.menu.close();
    };

    private _focusInListener = (event: FocusEvent): void => {
        this._elementRef.nativeElement.addEventListener('focusout', this._focusOutListener);
        this._elementRef.nativeElement.removeEventListener('focusin', this._focusInListener);
    };

    private _focusOutListener = (event: FocusEvent): void => {
        if (event.relatedTarget && !(event.currentTarget as HTMLElement).contains(event.relatedTarget as HTMLElement)) {
            this.menu.close();
        }
    };
}
