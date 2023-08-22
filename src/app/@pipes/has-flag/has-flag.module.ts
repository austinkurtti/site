import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HasFlagPipe } from './has-flag.pipe';

@NgModule({
    declarations: [
        HasFlagPipe
    ],
    exports: [
        HasFlagPipe
    ],
    imports: [
        CommonModule
    ]
})
export class HasFlagPipeModule {}
