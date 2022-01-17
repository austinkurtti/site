import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColorService } from '@singletons/color.service';

@Component({
    selector: 'ak-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('header', { static: true }) header: ElementRef;
    @ViewChild('main', { static: true }) main: ElementRef;

    public title = 'Austin Kurtti';
    public secretActivated = false;

    constructor(
        private _colorService: ColorService
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
    }
}
