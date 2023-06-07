import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { baseSizePx } from '@constants/numbers';
import { LocalStorageService } from '../@services/local-storage.service';

@Component({
    selector: 'ak-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
    @ViewChild('header') header: ElementRef;
    @ViewChild('headerMenuContent') headerMenuContent: ElementRef;

    public title = 'Austin Kurtti';
    public menuOpen = false;
    public currentThemeValue: boolean;

    private _themeKey = 'theme';

    constructor(
        private _renderer: Renderer2
    ) {}

    @HostListener('window:resize')
    windowResize() {
        if (this.menuOpen) {
            this.toggleMenu();
        }
    }

    public ngAfterViewInit(): void {
        this.currentThemeValue = !!LocalStorageService.getItem(this._themeKey);
        this._setTheme();
    }

    // TODO - toggleMenu when open and outside click occurs
    public toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        this._updateMenu();
    }

    public toggleTheme(): void {
        this.currentThemeValue = !LocalStorageService.getItem(this._themeKey);
        LocalStorageService.setItem(this._themeKey, this.currentThemeValue);
        this._setTheme();
    }

    private _updateMenu(): void {
        if (this.menuOpen) {
            this._renderer.removeClass(this.headerMenuContent.nativeElement, 'd-none');

            const headerHeight = this.header.nativeElement.offsetHeight;
            this._renderer.setStyle(this.headerMenuContent.nativeElement, 'top', `${headerHeight + baseSizePx}px`);
            this._renderer.setStyle(this.headerMenuContent.nativeElement, 'left', `${baseSizePx}px`);
        } else {
            this._renderer.addClass(this.headerMenuContent.nativeElement, 'd-none');
        }
    }

    private _setTheme(): void {
        document.documentElement.setAttribute('data-theme', this.currentThemeValue ? 'dark' : 'light');
    }
}
