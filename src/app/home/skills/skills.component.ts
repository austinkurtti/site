import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { skillsId, skillsText } from '@constants/strings';
import { DeferLoadDirective } from '../../@directives/defer-load/defer-load.directive';
import { SectionTitleComponent } from '../@controls/section-title/section-title.component';
import { SectionDirective } from '../@controls/section/section.directive';
import { SkillComponent } from './skill/skill.component';
import { SkillType, skills } from './skills.models';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html',
    imports: [
        CommonModule,
        DeferLoadDirective,
        SectionTitleComponent,
        SkillComponent
    ]
})
export class SkillsComponent extends SectionDirective implements OnInit {
    public navigationId = skillsId;
    public title = skillsText;
    public skills = skills;
    public skillFilters = SkillType.front | SkillType.back | SkillType.data | SkillType.tool;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SkillType = SkillType;

    public ngOnInit(): void {
        this.skills.shuffle();
    }

    public toggleFilter(type: SkillType) {
        this.skillFilters = this.skillFilters.toggleFlag(type);
    }
}
