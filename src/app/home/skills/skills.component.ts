import { Component } from '@angular/core';
import { colorAppAccent1, skillsId, skillsText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends SectionDirective {
    public navigationId = skillsId;

    public title = skillsText;
    public titleColor = colorAppAccent1;
}