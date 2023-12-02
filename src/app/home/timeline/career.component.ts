import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { careerId, careerText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';
import { CareerItemModel, careerItems } from './career-item.model';

@Component({
    selector: 'ak-career',
    styleUrls: ['./career.component.scss'],
    templateUrl: './career.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerComponent extends SectionDirective implements OnInit {
    public navigationId = careerId;
    public title = careerText;
    public careerItems = careerItems;
    public activeCareerItem: CareerItemModel;

    public ngOnInit(): void {
        if (this.careerItems.length && this.careerItems[0].children.length) {
            this.activeCareerItem = this.careerItems[0].children[0];
        }
    }
}
