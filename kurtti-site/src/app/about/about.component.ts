import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BaseComponent implements OnInit {
    @ViewChild('section') section: ElementRef;

    public backgroundViewBox = '0 0 0 0';
    public backgroundPath1 = '';
    public backgroundPath2 = '';

    public ngOnInit() {
        super.ngOnInit();
        this.title = 'ABOUT ME.';
    }

    // public ngAfterViewInit() {
        // super.ngAfterViewInit();
        // this.animationsComplete$.subscribe(complete => {
            // if (complete) {
                // const width = this.section.nativeElement.clientWidth;
                // const height = this.section.nativeElement.clientHeight;
                // this.backgroundViewBox = `0 0 ${width} ${height}`;
                // this.backgroundPath1 = `M${width},${height*.8} L${width *.4},${height*.8} L${width*.45},${height*.55} L${width},${height*.55} Z`;
                // this.backgroundPath2 = `M${width},${height*.75} L${width *.45},${height*.75} L${width*.5},${height*.5} L${width},${height*.5} Z`;
            // }
        // });
    // }

    protected secretActivated = (): void => {
        // Arm flex -- sunglasses face -- peace sign
        // this.title = '&#128170; &#128526; &#9996;';
    }
}
