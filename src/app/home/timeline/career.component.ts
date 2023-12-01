import { ChangeDetectionStrategy, Component } from '@angular/core';
import { careerId, careerText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';

@Component({
    selector: 'ak-career',
    styleUrls: ['./career.component.scss'],
    templateUrl: './career.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerComponent extends SectionDirective {
    public navigationId = careerId;
    public title = careerText;
}
