import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelinePipe } from './timeline.pipe';

@NgModule({
    declarations: [
        TimelinePipe
    ],
    exports: [
        TimelinePipe
    ],
    imports: [
        CommonModule
    ]
})
export class TimelinePipeModule {}
