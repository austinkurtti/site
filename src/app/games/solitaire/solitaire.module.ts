import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SolitaireComponent } from './solitaire.component';

@NgModule({
    declarations: [
        SolitaireComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: '',
            component: SolitaireComponent
        }])
    ]
})
export class SolitaireModule {}
