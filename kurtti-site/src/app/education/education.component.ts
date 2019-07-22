import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'education',
    styleUrls: ['./education.component.scss'],
    templateUrl: './education.component.html'
})
export class EducationComponent extends BaseComponent implements OnInit {
    public ngOnInit() {
        super.ngOnInit();
        this.title = 'I got learned.';
    }

    protected secretActivated = (): void => {
        // TODO: something fun
    }
}
