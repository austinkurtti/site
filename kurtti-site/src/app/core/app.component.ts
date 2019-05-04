import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ColorService } from '@singletons/color.service';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    private _secretCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    private _secretIndex = 0;
    private _secretHidden = true;

    constructor(
        private _colorService: ColorService
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
    }

    public ngAfterViewInit() {
        fromEvent(document, 'keyup')
            .pipe(takeWhile(x => this._secretHidden))
            .subscribe((e: KeyboardEvent) => {
                if (e.keyCode === this._secretCode[this._secretIndex++]) {
                    if (this._secretIndex === this._secretCode.length) {
                        this._secretHidden = false;
                        /**
                         * TODO: Something cool
                         * Ideas
                         * - Animate title into "Party Time"
                         * - Animate "Skill set." section title to "I have a particular set of skills."
                         * - Animate aside/header background to rainbows
                         * - Confetti
                         */
                        console.log('KONAMI CODE ENTERED');
                    }
                } else {
                    this._secretIndex = 0;
                }
            });
    }
}
