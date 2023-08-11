import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HasFlagPipeModule } from '@pipes/has-flag.module';
import { SudokuComponent } from './sudoku.component';

@NgModule({
    declarations: [
        SudokuComponent
    ],
    imports: [
        CommonModule,
        HasFlagPipeModule,
        RouterModule.forChild([{
            path: '',
            component: SudokuComponent
        }])
    ]
})
export class SudokuModule {}
