import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'experience',
    styleUrls: ['./experience.component.scss'],
    templateUrl: './experience.component.html'
})
export class ExperienceComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public ngOnInit() {
        // asdf
    }
}
