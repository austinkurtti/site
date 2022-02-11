import { Component } from '@angular/core';
import { aboutId, aboutText, colorAppAccent1 } from '@constants/strings';
import { SectionDirective } from '../section/section.directive';

@Component({
    selector: 'ak-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends SectionDirective {
    public navigationId = aboutId;

    public title = aboutText;
    public titleColor = colorAppAccent1;
}
