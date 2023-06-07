import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetDirective } from './let.directive';

@NgModule({
    declarations: [
        LetDirective
    ],
    exports: [
        LetDirective
    ],
    imports: [
        CommonModule
    ]
})
export class LetDirectiveModule {}
