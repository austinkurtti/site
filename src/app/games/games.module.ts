import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesHomeComponent } from './games-home.component';
import { GamesComponent } from './games.component';

@NgModule({
    declarations: [
        GamesComponent,
        GamesHomeComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: GamesComponent,
                children: [
                    {
                        path: '',
                        component: GamesHomeComponent,
                    },
                    {
                        path: 'sudoku',
                        loadChildren: () => import('./sudoku/sudoku.module').then(m => m.SudokuModule)
                    }
                ]
            }
        ])
    ]
})
export class GamesModule {}
