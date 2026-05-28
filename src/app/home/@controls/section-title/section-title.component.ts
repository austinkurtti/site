import { Component, Input } from '@angular/core';
import { TranslatableDirective } from '@directives/translatable/translatable.directive';

@Component({
    selector: 'ak-section-title',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.scss'],
    imports: [
        TranslatableDirective
    ]
})
export class SectionTitleComponent {
    @Input() text = '';
}
