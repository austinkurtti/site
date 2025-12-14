import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ThemeService } from '@services/theme.service';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GamesService } from '../../games.service';
import { WarshipsManager } from '../warships-manager';
import { WarshipsScreenState } from '../warships.models';

@Component({
    selector: 'ak-warships-menu-screen',
    styleUrls: ['./menu-screen.component.scss'],
    templateUrl: './menu-screen.component.html'
})
export class WarshipsMenuScreenComponent implements OnInit, OnDestroy {
    public gameManager = inject(WarshipsManager);
    public gamesService = inject(GamesService);

    public ScreenState = WarshipsScreenState;

    private _renderer = inject(Renderer2);
    private _themeService = inject(ThemeService);

    private _radarAngle = 0;
    private _animationFrame: any;

    private _destroyed$ = new Subject<void>();

    public ngOnInit(): void {
        if (!this._themeService.prefersReducedMotion) {
            this._animateRadar();
            this._schedulePing();
        }
    }

    public ngOnDestroy(): void {
        cancelAnimationFrame(this._animationFrame);
        this._destroyed$.next();
    }

    private _animateRadar(): void {
        const duration = 10000; // 10s (sync this with CSS animation duration)
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = (now - start) % duration;
            this._radarAngle = (elapsed / duration) * 360;
            this._animationFrame = requestAnimationFrame(animate);
        };
        this._animationFrame = requestAnimationFrame(animate);
    }

    private _schedulePing(): void {
        // Add a ping 3-6s in the future
        timer(3000 + Math.random() * 3000)
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._addPing();
                this._schedulePing();
            });
    }

    private _addPing(): void {
        // Calculate ping Cartesian coords
        const radarEl = document.querySelector('#radar');
        const radarElRect = radarEl.getBoundingClientRect();
        const radius = 20 + Math.random() * 80; // 20-100% of radar radius
        const r = (radius / 100) * (radarElRect.width / 2);
        const angleRad = (this._radarAngle - 90) * (Math.PI / 180);
        const x = (radarElRect.width / 2) + r * Math.cos(angleRad);
        const y = (radarElRect.width / 2) + r * Math.sin(angleRad);

        // Add ping element
        const pingEl = document.createElement('i');
        this._renderer.addClass(pingEl, 'fas');
        this._renderer.addClass(pingEl, 'fa-circle');
        this._renderer.setStyle(pingEl, 'color', '#ebde28'); // Same as $color-warships-radar-yellow
        this._renderer.setStyle(pingEl, 'position', 'absolute');
        this._renderer.setStyle(pingEl, 'left', `${x - 8}px`); // Adjust -8px for icon center (assuming 16px icon)
        this._renderer.setStyle(pingEl, 'top', `${y - 8}px`); // Adjust -8px for icon center (assuming 16px icon)
        this._renderer.setStyle(pingEl, 'animation', 'kfFade 2.1s ease-in');
        this._renderer.appendChild(radarEl, pingEl);

        // Remove ping after 2s
        timer(2000)
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => {
                this._renderer.removeChild(radarEl, pingEl);
            });
    }
}
