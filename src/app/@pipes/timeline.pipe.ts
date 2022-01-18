import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeline'
})
export class TimelinePipe implements PipeTransform {
    public transform(timelineStart: Date, pointDate: Date) {
        const timelineStartTime = timelineStart.getTime();
        return Math.round(((pointDate.getTime() - timelineStartTime) / (Date.now() - timelineStartTime)) * document.body.clientWidth);
    }
}
