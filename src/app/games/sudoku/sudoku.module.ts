import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TextComponent } from '@components/text/text.component';
import { ToggleComponent } from '@components/toggle/toggle.component';
import { MenuDirectiveModule } from '@directives/menu/menu.module';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';
import { DifficultyPipe } from '@pipes/difficulty.pipe';
import { HasFlagPipe } from '@pipes/has-flag.pipe';
import { SudokuComponent } from './sudoku.component';

@NgModule({
    declarations: [
        SudokuComponent
    ],
    imports: [
        CommonModule,
        DifficultyPipe,
        HasFlagPipe,
        MenuDirectiveModule,
        TextComponent,
        ToggleComponent,
        TooltipDirective,
        RouterModule.forChild([{
            path: '',
            component: SudokuComponent
        }])
    ]
})
export class SudokuModule {}
