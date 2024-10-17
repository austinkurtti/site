import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';
import { GamesHomeComponent } from './games-home.component';
import { GamesComponent } from './games.component';

@NgModule({
    declarations: [
        GamesComponent,
        GamesHomeComponent
    ],
    imports: [
        CommonModule,
        TooltipDirective,
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
                    },
                    {
                        path: 'tile-slide',
                        title: 'Tile Slide',
                        loadComponent: () => import('./tile-slide/tile-slide.component').then(x => x.TileSlideComponent)
                    }
                ]
            }
        ])
    ]
})
export class GamesModule {}
