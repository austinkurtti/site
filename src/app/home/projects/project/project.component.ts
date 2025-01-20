import { Component, Input } from '@angular/core';

@Component({
    selector: 'ak-project',
    styleUrls: ['./project.component.scss'],
    templateUrl: './project.component.html'
})
export class ProjectComponent {
    @Input() name: string;
}
