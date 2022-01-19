import { Component } from '@angular/core';
import { SectionDirective } from '@base/section.directive';
import { colorWhite } from '../@constants/strings';

@Component({
    selector: 'ak-intro',
    styleUrls: ['./intro.component.scss'],
    templateUrl: './intro.component.html'
})
export class IntroComponent extends SectionDirective {
    public title = 'Hi, I\'m Austin.';
    public titleColor = colorWhite;
}
