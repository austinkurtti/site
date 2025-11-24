import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesService } from './games.service';

@Component({
    selector: 'ak-games-home',
    styleUrls: ['./games-home.component.scss'],
    templateUrl: './games-home.component.html',
    imports: [
        CommonModule,
        RouterLink
    ]
})
export class GamesHomeComponent {
    public gamesService = inject(GamesService);
}
