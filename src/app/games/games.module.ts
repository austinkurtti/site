import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from '@directives/tooltip/tooltip.module';
import { GamesHomeComponent } from './games-home.component';
import { GamesComponent } from './games.component';

@NgModule({
    declarations: [
        GamesComponent,
        GamesHomeComponent
    ],
    imports: [
        CommonModule,
        TooltipModule,
        RouterModule.forChild([
            {
                path: '',
                component: GamesComponent,
                children: [
                    {
                        path: '',
                        component: GamesHomeComponent
                    },
                    {
                        path: 'sudoku',
                        title: 'Sudoku',
                        loadChildren: () => import('./sudoku/sudoku.module').then(m => m.SudokuModule)
                    }
                ]
            }
        ])
    ]
})
export class GamesModule {}
