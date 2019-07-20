import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'experience',
    styleUrls: ['./experience.component.scss'],
    templateUrl: './experience.component.html'
})
export class ExperienceComponent extends BaseComponent implements OnInit {
    public ngOnInit() {
        super.ngOnInit();
        this.title = 'NINE TO FIVES.';
    }

    protected secretActivated = (): void => {
        // Clock @ 9 -- right arrow -- clock @ 5
        // this.title = '&#128344; &#10145; &#128340;';
    }
}
