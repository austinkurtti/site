import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameLinkModel } from './games.models';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html'
})
export class GamesComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gameLinks') gameLinksEl: ElementRef;

    public showPlaceholder = true;
    public games: GameLinkModel[] = [
        new GameLinkModel('Sudoku', 'fas fa-border-all', 'sudoku'),
        // new GameLinkModel('Solitaire', 'fas fa-heart', 'solitaire'),
        // new GameLinkModel('Warship', 'fas fa-ship', 'warship')
    ];

    public navOpen$ = new BehaviorSubject<boolean>(true);

    private _destroyed$ = new Subject<void>();

    constructor(
        private _renderer: Renderer2
    ) {}

    public ngAfterViewInit(): void {
        this.navOpen$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(open => {
                if (open) {
                    this._renderer.removeStyle(this.gameLinksEl.nativeElement, 'transform');
                } else {
                    this._renderer.setStyle(this.gameLinksEl.nativeElement, 'transform', 'translateX(-100%)');
                }
            });
    }

    public ngOnDestroy(): void {
        this._destroyed$.next();
    }

    public gameActivate(): void {
        this.showPlaceholder = false;
        this.navOpen$.next(false);
    }

    public gameDeactivate(): void {
        this.showPlaceholder = true;
        this.navOpen$.next(true);
    }
}
