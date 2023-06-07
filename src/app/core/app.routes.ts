import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
    },
    // {
    //     path: 'games',
    //     loadChildren: () => import('../games/games.module').then(m => m.GamesModule)
    // },
    {
        path: 'page-not-found',
        loadChildren: () => import('../page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
    },
    {
        path: '**',
        redirectTo: 'page-not-found'
    }
];
