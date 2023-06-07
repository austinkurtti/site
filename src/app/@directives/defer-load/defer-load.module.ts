import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DeferLoadDirective } from './defer-load.directive';

@NgModule({
    declarations: [
        DeferLoadDirective
    ],
    exports: [
        DeferLoadDirective
    ],
    imports: [
        CommonModule
    ]
})
export class DeferLoadDirectiveModule {}
