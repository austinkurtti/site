import { Component, HostBinding, Input } from '@angular/core';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { SkillType } from '../skills.models';

@Component({
    selector: 'ak-skill',
    styleUrls: ['./skill.component.scss'],
    templateUrl: './skill.component.html'
})
export class SkillComponent {
    @Input() name: string;
    @Input() icon: string;
    @Input() type: SkillType;

    public tooltipPosition = TooltipPosition;

    @HostBinding('attr.skill-type') get typeClass() {
        return SkillType[this.type];
    }
}
