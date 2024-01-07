import { ChangeDetectionStrategy, Component } from '@angular/core';
import { careerId, careerText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';
import { CareerItemModel, careerItems } from './career-item.model';

@Component({
    selector: 'ak-career',
    styleUrls: ['./career.component.scss'],
    templateUrl: './career.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerComponent extends SectionDirective {
    public navigationId = careerId;
    public title = careerText;
    public careerItems = careerItems;
    public activeCareerItem: CareerItemModel;

    public toggleCareerItemExpanded(id: string): void {
        const toggledItem = this.careerItems.find(item => item.id === id);

        if (toggledItem.expanded) {
            toggledItem.expanded = false;
        } else {
            this.careerItems.forEach(item => item.expanded = item.id === id);
        }
    }
}
