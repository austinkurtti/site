import { Component, OnInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private _colorService: ColorService
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
    }
}
