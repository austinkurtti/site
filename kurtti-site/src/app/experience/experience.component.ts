import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { timer } from 'rxjs';

@Component({
    selector: 'experience',
    styleUrls: ['./experience.component.scss'],
    templateUrl: './experience.component.html'
})
export class ExperienceComponent extends BaseComponent implements OnInit, AfterViewInit {
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
        this.title = 'Nine to Fives.';
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
        // TODO: experience ribbon
        this.backgroundPath1 = `M${width*.55},0 L${width*.2},${height*.25} L${width*.21},${height*.4} L${width*.75},0 Z`;
        this.backgroundPath2 = `M${width*.2},${height*.25} L${width*.21},${height*.4} L${width*.85},${height*.75} L${width*.86},${height*.6} Z`;
    }
}
