import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuDirectiveModule } from '@directives/menu/menu.module';
import { DifficultyPipeModule } from '@pipes/difficulty/difficulty.module';
import { HasFlagPipeModule } from '@pipes/has-flag/has-flag.module';
import { SudokuComponent } from './sudoku.component';

@NgModule({
    declarations: [
        SudokuComponent
    ],
    imports: [
        CommonModule,
        DifficultyPipeModule,
        HasFlagPipeModule,
        MenuDirectiveModule,
        RouterModule.forChild([{
            path: '',
            component: SudokuComponent
        }])
    ]
})
export class SudokuModule {}
