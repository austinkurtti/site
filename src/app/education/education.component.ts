import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { timer } from 'rxjs';

@Component({
    selector: 'ak-education',
    styleUrls: ['./education.component.scss'],
    templateUrl: './education.component.html'
})
export class EducationComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('section', { static: true }) section: ElementRef;
    @ViewChild('backgroundCover', { static: true }) bgCover: ElementRef;

    public backgroundViewBox = '0 0 0 0';
    public backgroundPath1 = '';
    public backgroundPath2 = '';
    public backgroundPath3 = '';

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService,
        private _renderer: Renderer2
    ) {
        super(_colorService, _secretService);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'I got learned.';
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.animationsComplete$.subscribe(complete => {
            if (complete) {
                this._calculateBackground();
            }
        });
    }

    public onDeferLoad(): void {
        this.backgroundDeferClass = this.contentDeferClass = 'defer-load';
        timer(500).subscribe(() => {
            this._renderer.removeChild(this.section.nativeElement, this.bgCover.nativeElement);
        });
    }

    protected windowResized(): void {
        this._calculateBackground();
    }

    protected secretActivated(): void {
        // TODO: something fun
    }

    private _calculateBackground(): void {
        const width = this.section.nativeElement.clientWidth;
        const height = this.section.nativeElement.clientHeight;
        this.backgroundViewBox = `0 0 ${width} ${height}`;
        this.backgroundPath1 = `M${width * .5},0 L${width * .71},${height * .43} L${width * .72},${height * .15} L${width * .65},0 Z`;
        this.backgroundPath2 = `M${width * .72},${height * .15} L${width * .71},${height * .43} L${width * .12},${height * .8} L${width * .11},${height * .63} Z`;
        this.backgroundPath3 = `M${width * .11},${height * .63} L${width * .12},${height * .8} L${width * .25},${height} L${width * .4},${height} Z`;
    }
}
