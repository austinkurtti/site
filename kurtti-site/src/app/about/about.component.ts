import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public ngOnInit() {
        // asdf
    }
}
