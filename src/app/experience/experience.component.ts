import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { colorAppAccent1 } from '../@constants/strings';

@Component({
    selector: 'ak-experience',
    styleUrls: ['./experience.component.scss'],
    templateUrl: './experience.component.html'
})
export class ExperienceComponent extends SectionDirective {
    public title = 'Experience.';
    public titleColor = colorAppAccent1;
}
