import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { timer } from 'rxjs';

@Component({
    selector: 'ak-experience',
    styleUrls: ['./experience.component.scss'],
    templateUrl: './experience.component.html'
})
export class ExperienceComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('section', { static: true }) section: ElementRef;
    @ViewChild('backgroundCover', { static: true }) bgCover: ElementRef;

    public backgroundViewBox = '0 0 0 0';
    public backgroundPath1 = '';
    public backgroundPath2 = '';
    public backgroundPath3 = '';
    public backgroundPath4 = '';

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService,
        private _renderer: Renderer2
    ) {
        super(_colorService, _secretService);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'Experience.';
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
        this.backgroundPath1 = `M${width * .4},0 L${width * .25},0 L${width * .66},${height * .4} L${width * .6},${height * .17} Z`;
        this.backgroundPath2 = `M${width * .6},${height * .17} L${width * .66},${height * .4} L${width * .64},${height * .55} L${width * .53},${height * .71} Z`;
        this.backgroundPath3 = `M${width * .64},${height * .55} L${width * .53},${height * .71} L${width * .15},${height * .82} L${width * .16},${height * .68} Z`;
        this.backgroundPath4 = `M${width * .16},${height * .68} L${width * .15},${height * .82} L${width * .4},${height} L${width * .6},${height} Z`;
    }
}
