import { Component, OnInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';

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
        private _colorService: ColorService
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
        this.aboutColor = `${this._colorService.getRandomColorClass()}-hov`;
        this.resumeColor = `${this._colorService.getRandomColorClass()}-hov`;
        this.contactColor = `${this._colorService.getRandomColorClass()}-hov`;
    }
}
