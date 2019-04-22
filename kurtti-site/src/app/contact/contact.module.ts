import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ContactComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', pathMatch: 'full', component: ContactComponent}
        ])
    ]
})
export class ContactModule { }
