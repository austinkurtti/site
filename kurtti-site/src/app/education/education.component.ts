import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { timer } from 'rxjs';

@Component({
    selector: 'education',
    styleUrls: ['./education.component.scss'],
    templateUrl: './education.component.html'
})
export class EducationComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('section') section: ElementRef;
    @ViewChild('backgroundCover') bgCover: ElementRef;

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

    public onDeferLoad = (): void => {
        this.deferClass = 'defer-load';
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
        this.backgroundPath1 = `M${width*.55},0 L${width*.2},${height*.25} L${width*.21},${height*.4} L${width*.75},0 Z`;
        this.backgroundPath2 = `M${width*.2},${height*.25} L${width*.21},${height*.4} L${width*.85},${height*.75} L${width*.86},${height*.6} Z`;
        this.backgroundPath3 = `M${width*.86},${height*.6} L${width*.85},${height*.75} L${width*.45},${height} L${width*.25},${height} Z`;
    }
}
