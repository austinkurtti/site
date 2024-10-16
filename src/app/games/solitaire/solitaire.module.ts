import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetDirectiveModule } from '@directives/let/let.module';
import { SolitaireComponent } from './solitaire.component';

@NgModule({
    declarations: [
        SolitaireComponent
    ],
    imports: [
        CommonModule,
        DragDropModule,
        LetDirectiveModule,
        RouterModule.forChild([{
            path: '',
            component: SolitaireComponent
        }])
    ]
})
export class SolitaireModule {}
