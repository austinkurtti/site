import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { careerId, careerText, colorAppAccent2 } from '@constants/strings';
import { SectionDirective } from 'src/app/home/section/section.directive';
import { TimelineEventModel, timelineEvents } from './timeline-point.model';

// TODO - fix timeline not resizing

@Component({
    selector: 'ak-career',
    styleUrls: ['./career.component.scss'],
    templateUrl: './career.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareerComponent extends SectionDirective implements OnInit {
    public navigationId = careerId;

    public title = careerText;
    public titleColor = colorAppAccent2;

    public timelineStart = new Date(2013, 8);
    public timelineYears: Date[] = [];
    public timelineEvents = timelineEvents;
    public selectedEvent: TimelineEventModel;

    public ngOnInit(): void {
        this.selectedEvent = timelineEvents[0];

        const currentYear = new Date().getFullYear();
        let year = this.timelineStart.getFullYear() + 1;
        while (year <= currentYear) {
            this.timelineYears.push(new Date(year, 0));
            year++;
        }
    }

    public selectEvent(point: TimelineEventModel): void {
        this.selectedEvent = point;
    }
}
