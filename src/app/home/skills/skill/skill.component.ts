import { Component, Input } from '@angular/core';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';

@Component({
    selector: 'ak-skill',
    styleUrls: ['./skill.component.scss'],
    templateUrl: './skill.component.html'
})
export class SkillComponent {
    @Input() name: string;
    @Input() icon: string;
    @Input() level: 1 | 2 | 3 | 4 | 5;

    public tooltipPosition = TooltipPosition;
}
