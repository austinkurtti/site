import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { aboutId, aboutText } from '@constants/strings';
import { DeferLoadDirective } from '../../@directives/defer-load/defer-load.directive';
import { SectionTitleComponent } from '../@controls/section-title/section-title.component';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    imports: [
        DeferLoadDirective,
        RouterLink,
        SectionTitleComponent
    ]
})
export class AboutComponent extends SectionDirective {
    public navigationId = aboutId;
    public title = aboutText;
}
