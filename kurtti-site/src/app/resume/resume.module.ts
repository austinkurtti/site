import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeComponent } from './resume.component';
import { RouterModule } from '@angular/router';
import { DeferLoadDirective } from '@directives/defer-load.directive';

@NgModule({
    declarations: [
        ResumeComponent,
        DeferLoadDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', pathMatch: 'full', component: ResumeComponent}
        ])
    ]
})
export class ResumeModule { }
