import { Component, OnInit } from '@angular/core';
import { colorAppAccent1, skillsId, skillsText } from '@constants/strings';
import { SectionDirective } from '../section/section.directive';
import { skills } from './skill.model';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends SectionDirective implements OnInit {
    public navigationId = skillsId;

    public title = skillsText;
    public titleColor = colorAppAccent1;
    public skills = skills;

    private _colorClasses = ['bg-color-app-primary', 'bg-color-app-accent-1', 'bg-color-app-accent-2'];

    public ngOnInit(): void {
        // Randomize skill background colors
        let classes = [...this._colorClasses];
        this.skills.forEach(skill => {
            const color = classes[Math.floor(Math.random() * classes.length)];
            skill.color = color;
            classes = classes.filter(c => c !== color);
            if (!classes.length) {
                classes = [...this._colorClasses];
            }
        });
    }
}
