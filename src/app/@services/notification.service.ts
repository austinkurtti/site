import { Injectable, RendererFactory2, inject } from '@angular/core';
import { Notification } from '@models/notification.model';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class NotificationService {
    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    private _notificationEl: any;

    public info(model: Notification): void {
        this._buildElement(model, 'fa-info-circle');
        this._renderer.addClass(this._notificationEl, 'info');
        this._showElement(model);
    }

    public success(model: Notification): void {
        this._buildElement(model, 'fa-check-circle');
        this._renderer.addClass(this._notificationEl, 'success');
        this._showElement(model);
    }

    public error(model: Notification): void {
        this._buildElement(model, 'fa-times-circle');
        this._renderer.addClass(this._notificationEl, 'error');
        this._showElement(model);
    }

    private _buildElement(model: Notification, iconClass: string): void {
        // Create base notification element
        this._notificationEl = this._renderer.createElement('div');
        this._renderer.addClass(this._notificationEl, 'ak-notification');

        // Create and append icon element
        const iconEl = this._renderer.createElement('i');
        this._renderer.addClass(iconEl, 'fas');
        this._renderer.addClass(iconEl, iconClass);
        this._renderer.appendChild(this._notificationEl, iconEl);

        // Create and append message element
        const messageEl = this._renderer.createElement('span');
        messageEl.innerHTML = model.message;
        this._renderer.appendChild(this._notificationEl, messageEl);
    }

    private _showElement(model: Notification): void {
        const appRootEl = document.querySelector('ak-app-root');
        this._renderer.appendChild(appRootEl, this._notificationEl);
        timer((model.duration * 1000)).pipe(take(1)).subscribe(() => {
            this._renderer.removeChild(appRootEl, this._notificationEl);
            this._notificationEl = null;
        });
    }
}
