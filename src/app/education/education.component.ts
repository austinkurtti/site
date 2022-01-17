import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { colorAppAccent2 } from '../@constants/strings';

@Component({
    selector: 'ak-education',
    styleUrls: ['./education.component.scss'],
    templateUrl: './education.component.html'
})
export class EducationComponent extends SectionDirective {
    public title = 'I got learned.';
    public titleColor = colorAppAccent2;
}
