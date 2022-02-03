import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { aboutId, aboutText, colorAppAccent1 } from '../@constants/strings';

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
