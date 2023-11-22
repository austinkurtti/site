import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        title: 'Austin Kurtti',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'games',
        title: 'Games',
        loadChildren: () => import('../games/games.module').then(m => m.GamesModule)
    },
    {
        path: 'page-not-found',
        title: 'Page Not Found',
        loadChildren: () => import('../page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
    },
    {
        path: '**',
        redirectTo: 'page-not-found'
    }
];
