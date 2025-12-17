import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeComponent } from '@components/theme/theme.component';
import { MenuContentDirective } from '@directives/menu/menu-content.directive';
import { MenuDirective, MenuPosition } from '@directives/menu/menu.directive';
import { GamesService } from './games.service';

@Component({
    selector: 'ak-games-home',
    styleUrls: ['./games-home.component.scss'],
    templateUrl: './games-home.component.html',
    imports: [
        CommonModule,
        MenuDirective,
        MenuContentDirective,
        RouterLink,
        ThemeComponent
    ]
})
export class GamesHomeComponent {
    public gamesService = inject(GamesService);

    public MenuPosition = MenuPosition;
}
