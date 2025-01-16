import { Component, QueryList, ViewChildren } from '@angular/core';
import { careerId, careerText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';
import { CareerItemComponent } from './career-item/career-item.component';

@Component({
    selector: 'ak-career',
    styleUrls: ['./career.component.scss'],
    templateUrl: './career.component.html',
    standalone: false
})
export class CareerComponent extends SectionDirective {
    @ViewChildren(CareerItemComponent) careerItems: QueryList<CareerItemComponent>;

    public navigationId = careerId;
    public title = careerText;

    public toggleItemExpanded(id: string): void {
        const toggledItem = this.careerItems.find(item => item.id === id);

        if (toggledItem.expanded) {
            toggledItem.expanded = false;
        } else {
            this.careerItems.forEach(item => item.expanded = item.id === id);
        }
    }
}
