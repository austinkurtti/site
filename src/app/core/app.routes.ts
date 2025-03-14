import { Routes } from '@angular/router';
import { GamesHomeComponent } from '../games/games-home.component';
import { GamesComponent } from '../games/games.component';
import { SudokuComponent } from '../games/sudoku/sudoku.component';
import { HomeComponent } from '../home/home.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        title: 'Austin Kurtti',
        component: HomeComponent
    },
    {
        path: 'games',
        component: GamesComponent,
        children: [
            {
                path: '',
                title: 'Games',
                component: GamesHomeComponent
            },
            {
                path: 'sudoku',
                title: 'Sudoku',
                component: SudokuComponent
            }
        ]
    },
    {
        path: 'page-not-found',
        title: 'Page Not Found',
        component: PageNotFoundComponent
    },
    {
        path: '**',
        redirectTo: 'page-not-found'
    }
];
