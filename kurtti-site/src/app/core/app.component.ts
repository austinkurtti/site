import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ColorService } from '@singletons/color.service';
import { fromEvent, timer } from 'rxjs';
import { takeWhile, filter } from 'rxjs/operators';
import { SecretService } from '@singletons/secret.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('header') header: ElementRef;
    @ViewChild('main') main: ElementRef;

    public title = 'Austin Kurtti';
    public secretActivated = false;

    private _secretCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    private _secretIndex = 0;

    constructor(
        private _colorService: ColorService,
        private _secretService: SecretService,
        private _renderer: Renderer2
    ) { }

    public ngOnInit() {
        this._colorService.resetNumberPool();
        this._secretService.secretActivated$
            .pipe(filter(x => x))
            .subscribe(() => this._secretActivated());
    }

    public ngAfterViewInit() {
        timer(5000).subscribe(() => {
            this._renderer.addClass(this.main.nativeElement, 'd-block');
        });
        fromEvent(document, 'keyup')
            .pipe(takeWhile(x => !this.secretActivated))
            .subscribe((e: KeyboardEvent) => {
                if (e.keyCode === this._secretCode[this._secretIndex++]) {
                    if (this._secretIndex === this._secretCode.length) {
                        this.secretActivated = true;
                        this._secretService.secretActivated$.next(true);
                    }
                } else {
                    this._secretIndex = 0;
                }
            });
    }

    private _secretActivated = (): void => {
        // TODO: something fun
        // console.log('KONAMI CODE ENTERED');
    }
}
