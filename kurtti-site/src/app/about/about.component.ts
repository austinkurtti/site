import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@base/base.component';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BaseComponent implements OnInit {
    public ngOnInit() {
        super.ngOnInit();
        this.title = 'A little about me.';
    }

    protected secretActivated = (): void => {
        this.title = '&#128170; &#128526; &#9996;';
    }
}
