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
        this.title = 'Nine to fives.';
    }

    protected secretActivated = (): void => {
        this.title = '&#128344; &#10145; &#128340;';
    }
}
