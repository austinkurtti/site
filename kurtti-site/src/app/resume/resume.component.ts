import { Component, OnInit } from '@angular/core';
import { RandomService } from '@singletons/random.service';

@Component({
    selector: 'resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
    public educationColor: string;
    public experienceColor: string;
    public experienceColorBg: string;
    public skillsColor: string;

    constructor(
        private _randomService: RandomService
    ) { }

    public ngOnInit() {
        this._randomService.resetNumberPool();
        this.educationColor = this._randomService.getRandomColorClass([4, 5, 6]);
        this.experienceColor = this._randomService.getRandomColorClass();
        this.experienceColorBg = `${this.experienceColor}-bg`;
        this.skillsColor = this._randomService.getRandomColorClass([4, 5, 6]);
    }

}
