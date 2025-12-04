import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from '@components/theme/theme.component';
import { MenuContentDirective } from '@directives/menu/menu-content.directive';
import { MenuDirective, MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { TooltipDirective } from '../@directives/tooltip/tooltip.directive';
import { GamesService } from './games.service';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html',
    imports: [
        CommonModule,
        MenuDirective,
        MenuContentDirective,
        RouterOutlet,
        ThemeComponent,
        TooltipDirective
    ],
    providers: [
        GamesService
    ]
})
export class GamesComponent {
    public gamesService = inject(GamesService);

    public MenuPosition = MenuPosition;
    public TooltipPosition = TooltipPosition;

    public routerOutletActivate(activatedComponent: any) {
        this.gamesService.activeGame.set(this.gamesService.games.find(g => !g.disabled && activatedComponent instanceof g.class));
    }
}
