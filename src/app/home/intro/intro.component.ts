import { Component } from '@angular/core';
import { introId } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-intro',
    styleUrls: ['./intro.component.scss'],
    templateUrl: './intro.component.html',
    standalone: false
})
export class IntroComponent extends SectionDirective {
    public navigationId = introId;
}
