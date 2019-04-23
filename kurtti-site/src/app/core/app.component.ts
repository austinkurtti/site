import { Component, OnInit } from '@angular/core';
import { RandomService } from '@singletons/random.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'Austin Kurtti';
    public aboutColor: string;
    public resumeColor: string;
    public contactColor: string;

    constructor(
        private _randomService: RandomService
    ) { }

    public ngOnInit() {
        this._randomService.resetNumberPool();
        this.aboutColor = `${this._randomService.getRandomColorClass()}-hov`;
        this.resumeColor = `${this._randomService.getRandomColorClass()}-hov`;
        this.contactColor = `${this._randomService.getRandomColorClass()}-hov`;
    }
}
