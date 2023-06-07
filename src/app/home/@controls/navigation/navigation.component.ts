import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { aboutId, aboutText, introId, introText, skillsId, skillsText, timelineId, timelineText } from '@constants/strings';
import { Subscription, timer } from 'rxjs';
import { NavigationAnchorModel } from './navigation.model';

@Component({
    selector: 'ak-navigation',
    styleUrls: ['./navigation.component.scss'],
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal'; // TODO - enum this

    @ViewChildren('navAnchor') navAnchors: QueryList<ElementRef>;

    @HostBinding('class.horizontal')
    get horizontal() {
        return this.orientation === 'horizontal';
    }
    @HostBinding('class.vertical')
    get vertical() {
        return this.orientation === 'vertical';
    }

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
            id: timelineId,
            text: timelineText
        }),
        new NavigationAnchorModel({
            id: skillsId,
            text: skillsText
        })
    ];

    private _debounce: Subscription = null;
    private _activeAnchor: ElementRef = null;

    constructor(
        private _renderer: Renderer2
    ) {}

    @HostListener('window:scroll')
    windowScroll() {
        if (!this._debounce) {
            // Restrict this to running at most every tenth of a second so its not cumbersome
            this._debounce = timer(100).subscribe(() => {
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

    public ngAfterViewInit(): void {
        // Do initial nav anchor active calculation
        this.windowScroll();
    }

    public ngOnDestroy(): void {
        this._clearDebounce();
    }

    private _clearDebounce(): void {
        if (this._debounce) {
            this._debounce.unsubscribe();
            this._debounce = null;
        }
    }
}
