import { Component, OnInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';

@Component({
    selector: 'resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
    public educationColor: string;
    public educationDefer = 'invisible';
    public experienceColor: string;
    public experienceColorBg: string;
    public experienceDefer = 'invisible';
    public skillsColor: string;
    public skillsDefer = 'invisible';

    public deferThreshold = .25;

    constructor(
        private _colorService: ColorService
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
        this.educationColor = this._colorService.getRandomColorClass([4, 5, 6]);
        this.experienceColor = this._colorService.getRandomColorClass();
        this.experienceColorBg = `${this.experienceColor}-bg`;
        this.skillsColor = this._colorService.getRandomColorClass([4, 5, 6]);
    }

}
