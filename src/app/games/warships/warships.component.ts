import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '@services/theme.service';
import { WarshipsEndGameScreenComponent } from "./end-game-screen/end-game-screen.component";
import { WarshipsGameScreenComponent } from './game-screen/game-screen.component';
import { WarshipsMenuScreenComponent } from './menu-screen/menu-screen.component';
import { WarshipsNewGameScreen } from './new-game-screen/new-game-screen.component';
import { WarshipsManager } from './warships-manager';
import { WarshipsScreenState } from './warships.models';

@Component({
    selector: 'ak-warships',
    templateUrl: './warships.component.html',
    host: {
        'class': 'w-100 overflow-hidden flex-grow-1'
    },
    imports: [
        CommonModule,
        WarshipsEndGameScreenComponent,
        WarshipsGameScreenComponent,
        WarshipsMenuScreenComponent,
        WarshipsNewGameScreen
    ],
    providers: [
        WarshipsManager
    ]
})
export class WarshipsComponent implements OnInit, OnDestroy {
    public gameManager = inject(WarshipsManager);

    public ScreenState = WarshipsScreenState;

    private _themeService = inject(ThemeService);

    public ngOnInit(): void {
        this.gameManager.initialize();
        this._themeService.themeOverride('dark');
    }

    public ngOnDestroy(): void {
        this._themeService.removeThemeOverride();
    }
}
