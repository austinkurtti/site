import { Injectable, signal } from '@angular/core';

class WorkerRequest {
    public grant: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    private _workersEnabled = false;
    private _allowedWorkerCount = 0;
    private _currentWorkerCount = signal(0);
    private _workerRequestQueue: WorkerRequest[] = [];

    constructor() {
        if (window.isSecureContext && typeof Worker !== 'undefined') {
            this._workersEnabled = true;
            // TODO - should this allow all threads to be taken?
            // Should be between 1 and number of logical processors potentially available
            this._allowedWorkerCount = navigator.hardwareConcurrency;
        } else {
            this._workersEnabled = false;
            // TODO - web workers unavailable, do something?
        }
    }

    /**
     * Request the ability to move forward with creating a web worker. If there is no immediate capacity, the request will be put in a queue.
     *
     * Remember to call `releaseWorker()` after worker is finished, otherwise future requests may never be granted.
     *
     * @returns Promise\<void\> that resolves when request is granted
     */
    public requestWorker(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._workersEnabled) {
                reject();
            }

            const grantRequest = () => {
                this._recordRequest();
                resolve();
            };

            if (this._currentWorkerCount() < this._allowedWorkerCount) {
                grantRequest();
            } else {
                const request = new WorkerRequest();
                request.grant = grantRequest;
                this._workerRequestQueue.push(request);
            }
        });
    }

    /**
     * Updates internal worker count and grants the next request in the queue, if any.
     */
    public releaseWorker() {
        this._currentWorkerCount.update(value => value - 1);

        if (this._workerRequestQueue.length > 0) {
            const request = this._workerRequestQueue.shift();
            request.grant();
        }
    }

    private _recordRequest = (): void => {
        this._currentWorkerCount.update(value => value + 1);
    }
}
