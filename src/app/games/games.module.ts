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
                component: GamesComponent,
                children: [
                    {
                        path: 'sudoku',
                        outlet: 'g',
                        loadChildren: () => import('./sudoku/sudoku.module').then(m => m.SudokuModule)
                    }
                ]
            }
        ])
    ]
})
export class GamesModule {}
