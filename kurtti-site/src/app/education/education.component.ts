import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'education',
    styleUrls: ['./education.component.scss'],
    templateUrl: './education.component.html'
})
export class EducationComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public ngOnInit() {
        // asdf
    }
}
