import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { ThemeComponent } from '@components/theme/theme.component';
import { MenuContentDirective } from '@directives/menu/menu-content.directive';
import { MenuDirective, MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { TooltipDirective } from '../@directives/tooltip/tooltip.directive';
import { GamesService } from './games.service';

@Component({
    selector: 'ak-games',
    styleUrls: ['./games.component.scss'],
    templateUrl: './games.component.html',
    imports: [
        CommonModule,
        MenuDirective,
        MenuContentDirective,
        RouterOutlet,
        ThemeComponent,
        TooltipDirective
    ],
    providers: [
        GamesService
    ]
})
export class GamesComponent {
    public gamesService = inject(GamesService);

    public MenuPosition = MenuPosition;
    public TooltipPosition = TooltipPosition;

    private _dialogService = inject(DialogService);
    private _router = inject(Router);

    public routerOutletActivate(activatedComponent: any) {
        this.gamesService.activeGame.set(this.gamesService.games.find(g => !g.disabled && activatedComponent instanceof g.class));
    }

    public confirmExit(): void {
        const componentRef = this._dialogService.show(ConfirmDialogComponent, DialogSize.minimal, false);
        if (componentRef) {
            componentRef.title = 'Confirm Exit';
            componentRef.message = `You are about to exit ${this.gamesService.activeGame().name}. Would you like to continue?`;
            componentRef.confirmText = 'Exit';
            componentRef.cancelText = 'Cancel';
            componentRef.confirm = () => {
                this._dialogService.close();
                this._router.navigateByUrl('/games');
            };
            componentRef.cancel = () => {
                this._dialogService.close();
            }
        }
    }
}
