import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { colorAppAccent1 } from '../@constants/strings';

@Component({
    selector: 'ak-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends SectionDirective {
    public title = 'About me';
    public titleColor = colorAppAccent1;
}
