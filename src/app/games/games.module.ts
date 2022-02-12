import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameTileComponent } from './@controls/game-tile.component';
import { GamesComponent } from './games.component';

@NgModule({
    declarations: [
        GamesComponent,
        GameTileComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: GamesComponent
            },
            {
                path: 'solitaire',
                loadChildren: () => import('./solitaire/solitaire.module').then(m => m.SolitaireModule)
            }
        ])
    ]
})
export class GamesModule {}
