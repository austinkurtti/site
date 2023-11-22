import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DifficultyPipe } from './difficulty.pipe';

@NgModule({
    declarations: [
        DifficultyPipe
    ],
    exports: [
        DifficultyPipe
    ],
    imports: [
        CommonModule
    ]
})
export class DifficultyPipeModule {}
