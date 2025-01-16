import { Component } from '@angular/core';
import { aboutId, aboutText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent extends SectionDirective {
    public navigationId = aboutId;
    public title = aboutText;
}
