import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { colorAppAccent2, timelineId, timelineText } from '@constants/strings';
import { SectionDirective } from '../@controls/section/section.directive';
import { TimelineEventModel, timelineEvents } from './timeline-point.model';

// TODO - fix timeline not resizing

@Component({
    selector: 'ak-timeline',
    styleUrls: ['./timeline.component.scss'],
    templateUrl: './timeline.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent extends SectionDirective implements OnInit {
    public navigationId = timelineId;

    public title = timelineText;
    public titleColor = colorAppAccent2;

    public timelineStart = new Date(2011, 8);
    public timelineYears: Date[] = [];
    public timelineEvents = timelineEvents;

    public ngOnInit(): void {
        const currentYear = new Date().getFullYear();
        let year = this.timelineStart.getFullYear() + 1;
        while (year <= currentYear) {
            this.timelineYears.push(new Date(year, 0));
            year++;
        }
    }

    public eventClick(point: TimelineEventModel): void {
        point.expanded = !point.expanded;
    }
}
