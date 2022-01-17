import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { colorAppAccent2 } from '../@constants/strings';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends SectionDirective {
    public title = 'Skill set.';
    public titleColor = colorAppAccent2;
    public autoScrollCarousel = false;
    public skills = [
        'devicon-html5-plain',
        'devicon-angularjs-plain',
        'devicon-visualstudio-plain',
        'devicon-typescript-plain',
        'devicon-css3-plain',
        'devicon-csharp-plain',
        'devicon-dot-net-plain',
        'devicon-git-plain',
        'devicon-mysql-plain',
        'devicon-bootstrap-plain',
        'devicon-windows8-plain',
        'devicon-bitbucket-plain',
        'devicon-php-plain',
        'devicon-javascript-plain',
        'devicon-sass-plain',
        'devicon-nodejs-plain'
    ];

    public deferLoad(): void {
        super.deferLoad();
        this.autoScrollCarousel = true;
    }
}
