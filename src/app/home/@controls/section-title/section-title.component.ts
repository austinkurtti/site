import { Component, Input } from '@angular/core';

@Component({
    selector: 'ak-section-title',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.scss'],
    standalone: false
})
export class SectionTitleComponent {
    @Input() text = '';
}
