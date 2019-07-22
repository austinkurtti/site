import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends BaseComponent implements OnInit {
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
        'devicon-android-plain',
        'devicon-nodejs-plain'
    ];

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'Skill set.';
    }

    public onDeferLoad = (): void => {
        this.deferClass = 'defer-load';
        this.autoScrollCarousel = true;
    }

    protected secretActivated = (): void => {
        // TODO: something fun
    }
}
