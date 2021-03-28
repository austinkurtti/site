import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { timer } from 'rxjs';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';

@Component({
    selector: 'ak-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('section') section: ElementRef;
    @ViewChild('backgroundCover') bgCover: ElementRef;

    public backgroundViewBox = '0 0 0 0';
    public backgroundPath1 = '';
    public backgroundPath2 = '';

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService,
        private _renderer: Renderer2
    ) {
        super(_colorService, _secretService);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'About me.';
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.animationsComplete$.subscribe(complete => {
            if (complete) {
                this._calculateBackground();
            }
        });
    }

    public onDeferLoad = (): void => {
        this.backgroundDeferClass = this.contentDeferClass = 'defer-load';
        timer(500).subscribe(() => {
            this._renderer.removeChild(this.section.nativeElement, this.bgCover.nativeElement);
        });
    }

    protected windowResized = (): void => {
        this._calculateBackground();
    }

    protected secretActivated = (): void => {
        // TODO: something fun
    }

    private _calculateBackground = (): void => {
        const width = this.section.nativeElement.clientWidth;
        const height = this.section.nativeElement.clientHeight;
        this.backgroundViewBox = `0 0 ${width} ${height}`;
        this.backgroundPath1 = `M${width * .62},0 L${width * .2},${height * .37} L${width * .22},${height * .55} L${width * .8},0 Z`;
        this.backgroundPath2 = `M${width * .2},${height * .37} L${width * .22},${height * .55} L${width * .5},${height} L${width * .65},${height} Z`;
    }
}
