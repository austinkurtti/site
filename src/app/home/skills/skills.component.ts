import { Component, OnInit } from '@angular/core';
import { skillsId, skillsText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';
import { skills } from './skills.models';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends SectionDirective implements OnInit {
    public navigationId = skillsId;
    public title = skillsText;
    public skills = skills;

    public ngOnInit(): void {
        this.skills.shuffle();
    }
}
