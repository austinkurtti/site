import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { aboutId, aboutText, careerId, careerText, introId, introText, skillsId, skillsText } from '@constants/strings';
import { MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { LocalStorageService } from '@services/local-storage.service';
import { Subscription, timer } from 'rxjs';
import { NavigationAnchorModel } from './navigation.model';

@Component({
    selector: 'ak-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
    standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('header') header: ElementRef;
    @ViewChild('headerMenuContent') headerMenuContent: ElementRef;

    @ViewChildren('navAnchor') navAnchors: QueryList<ElementRef>;

    public title = 'AUSTIN KURTTI';
    public currentThemeValue: boolean;

    public navigationAnchors = [
        new NavigationAnchorModel({
            id: introId,
            text: introText
        }),
        new NavigationAnchorModel({
            id: aboutId,
            text: aboutText
        }),
        new NavigationAnchorModel({
            id: careerId,
            text: careerText
        }),
        new NavigationAnchorModel({
            id: skillsId,
            text: skillsText
        })
    ];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public MenuPosition = MenuPosition;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public TooltipPosition = TooltipPosition;

    private _renderer = inject(Renderer2);

    private _themeKey = 'theme';
    private _debounce: Subscription = null;
    private _activeAnchor: ElementRef = null;

    @HostListener('window:scroll')
    public updateActiveNav() {
        if (!this._debounce && this.navAnchors.length) {
            // Give scrolling a half second to settle to prevent weird link animations
            this._debounce = timer(500).subscribe(() => {
                const scrollTop = document.documentElement.scrollTop;
                const screenHeight = document.documentElement.clientHeight;

                // Calculate percentage each section takes up on screen
                const percentages = Array.from(document.querySelectorAll('section')).map((section: HTMLElement) => {
                    const percentage = section.offsetTop < scrollTop
                        ? ((section.offsetTop + section.offsetHeight) - scrollTop) / screenHeight
                        : ((scrollTop + screenHeight) - section.offsetTop) / screenHeight;
                    return Math.round(percentage * 100);
                });

                // Match nav anchor to most visible section
                const anchor = this.navAnchors.toArray()[percentages.indexOf(Math.max(...percentages))].nativeElement;

                // Update active nav anchor if changed
                if (this._activeAnchor !== anchor) {
                    if (this._activeAnchor) {
                        this._renderer.removeClass(this._activeAnchor, 'active');
                    }
                    this._renderer.addClass(anchor, 'active');
                    this._activeAnchor = anchor;
                }

                this._clearDebounce();
            });
        }
    }

    public ngOnInit(): void {
        this.currentThemeValue = !!LocalStorageService.getItem(this._themeKey);
    }

    public ngAfterViewInit(): void {
        this._setTheme();
        this.updateActiveNav();
    }

    public ngOnDestroy(): void {
        this._clearDebounce();
    }

    public toggleTheme(): void {
        this.currentThemeValue = !LocalStorageService.getItem(this._themeKey);
        LocalStorageService.setItem(this._themeKey, this.currentThemeValue);
        this._setTheme();
    }

    private _setTheme(): void {
        document.documentElement.setAttribute('data-theme', this.currentThemeValue ? 'dark' : 'light');
    }

    private _clearDebounce(): void {
        if (this._debounce) {
            this._debounce.unsubscribe();
            this._debounce = null;
        }
    }
}
