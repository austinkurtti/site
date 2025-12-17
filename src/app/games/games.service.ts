import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { GameModel } from './games.models';
import { SudokuComponent } from './sudoku/sudoku.component';
import { WarshipsComponent } from './warships/warships.component';

@Injectable()
export class GamesService {
    public activeGame = signal<GameModel>(null);

    public games: GameModel[] = [
        new GameModel({
            name: 'Sudoku',
            icon: 'fas fa-border-all',
            route: 'sudoku',
            class: SudokuComponent
        }),
        new GameModel({
            name: 'Warships',
            icon: 'fas fa-anchor',
            route: 'warships',
            class: WarshipsComponent
        }),
        new GameModel({
            name: 'Solitaire',
            icon: 'fas fa-heart',
            route: 'solitaire',
            disabled: true
        })
    ];

    private _dialogService = inject(DialogService);
    private _router = inject(Router);

    public confirmExit(): void {
        const componentRef = this._dialogService.show(ConfirmDialogComponent, DialogSize.minimal, false);
        if (componentRef) {
            componentRef.title = 'Confirm Exit';
            componentRef.message = `You are about to exit ${this.activeGame().name}. Would you like to continue?`;
            componentRef.confirmText = 'Exit';
            componentRef.confirmClass = 'cancel-button';
            componentRef.cancelText = 'Cancel';
            componentRef.cancelClass = '';
            componentRef.confirm = () => {
                this._dialogService.close();
                this._router.navigateByUrl('/games');
            };
            componentRef.cancel = () => {
                this._dialogService.close();
            }
        }
    }

    private _attrDataGameEffect = effect(() => {
        if (this.activeGame()) {
            document.documentElement.setAttribute('data-game', this.activeGame().name.toLowerCase().replaceAll(' ', '-'));
        } else {
            document.documentElement.removeAttribute('data-game');
        }
    });
}
