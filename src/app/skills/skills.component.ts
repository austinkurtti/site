import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BaseComponent } from '@base/base.component';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { timer } from 'rxjs';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('section', { static: true }) section: ElementRef;
    @ViewChild('backgroundCover', { static: true }) bgCover: ElementRef;

    public backgroundViewBox = '0 0 0 0';
    public backgroundPath1 = '';
    public backgroundPath2 = '';
    public backgroundPath3 = '';
    public autoScrollCarousel = false;
    public skills = [
        'devicon-html5-plain',
        'devicon-angularjs-plain',
        'devicon-visualstudio-plain',
        'devicon-typescript-plain',
        'devicon-css3-plain',
        'devicon-csharp-plain',
        'devicon-dot-net-plain',
        'devicon-git-plain',
        'devicon-mysql-plain',
        'devicon-bootstrap-plain',
        'devicon-windows8-plain',
        'devicon-bitbucket-plain',
        'devicon-php-plain',
        'devicon-javascript-plain',
        'devicon-sass-plain',
        'devicon-android-plain',
        'devicon-nodejs-plain'
    ];

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService,
        private _renderer: Renderer2
    ) {
        super(_colorService, _secretService);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'Skill set.';
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
        this.autoScrollCarousel = true;
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
        this.backgroundPath1 = `M${width * .6},0 L${width * .4},0 L${width * .85},${height * .35} L${width * .84},${height * .17} Z`;
        this.backgroundPath2 = `M${width * .84},${height * .17} L${width * .85},${height * .35} L${width * .2},${height * .62} L${width * .19},${height * .48} Z`;
        this.backgroundPath3 = `M${width * .19},${height * .48} L${width * .2},${height * .62} L${width * .45},${height} L${width * .6},${height} Z`;
    }
}
