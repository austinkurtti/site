import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
    public deferThreshold = .25;
    public deferClass = 'invisible';

    public ngOnInit() {
        // asdf
    }
}
