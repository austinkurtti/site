import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogDirective } from '@directives/dialog/dialog.directive';

@Component({
    standalone: true,
    selector: 'ak-help-dialog',
    styleUrls: ['./help-dialog.component.scss'],
    templateUrl: './help-dialog.component.html',
    imports: [
        CommonModule
    ]
})
export class HelpDialogComponent extends DialogDirective implements OnInit {
    public showNumLockWarning = false;

    public ngOnInit(): void {
        // Only show for Windows, and Chrome/Edge or Firefox (most affected)
        // TODO - update to navigator.userAgentData once it is widely available (https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData)
        this.showNumLockWarning = navigator.platform.startsWith('Win') && /Chrome|Edg|Mozilla/.test(navigator.userAgent);
    }
}
