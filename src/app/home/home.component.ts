import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { baseSizePx } from '../@constants/numbers';

@Component({
    selector: 'ak-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    @ViewChild('header') header: ElementRef;
    @ViewChild('headerMenuContent') headerMenuContent: ElementRef;

    public title = 'Austin Kurtti';
    public menuOpen = false;

    constructor(
        private _renderer: Renderer2
    ) {}

    @HostListener('window:resize')
    windowResize() {
        if (this.menuOpen) {
            this.toggleMenu();
        }
    }

    // TODO - toggleMenu when open and outside click occurs
    public toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        this._updateMenu();
    }

    private _updateMenu(): void {
        if (this.menuOpen) {
            this._renderer.removeClass(this.headerMenuContent.nativeElement, 'd-none');

            const headerHeight = this.header.nativeElement.offsetHeight;
            this._renderer.setStyle(this.headerMenuContent.nativeElement, 'top', `${headerHeight + baseSizePx}px`);

            const screenWidth = document.documentElement.clientWidth;
            const menuWidth = this.headerMenuContent.nativeElement.offsetWidth;
            this._renderer.setStyle(this.headerMenuContent.nativeElement, 'left', `${screenWidth - menuWidth - baseSizePx}px`);
        } else {
            this._renderer.addClass(this.headerMenuContent.nativeElement, 'd-none');
        }
    }
}
