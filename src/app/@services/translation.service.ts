import { inject, Injectable } from '@angular/core';
import { TranslatableDirective } from '@directives/translatable/translatable.directive';
import { BehaviorSubject } from 'rxjs';
import { skip, takeWhile } from 'rxjs/operators';
import { WorkerService } from './worker.service';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    public models = [];

    public modelsLoading$ = new BehaviorSubject<boolean>(false);
    public translating$ = new BehaviorSubject<boolean>(false);

    private _workerService = inject(WorkerService);

    private _translatables: TranslatableDirective[] = [];
    private _translatableQueue: TranslatableDirective[] = [];
    private _translatingIndex = 0;
    private _translationWorker: Worker;
    private _workersEnabled = false;
    private _targetLanguage = 'eng_Latn';

    constructor() {
        if (window.isSecureContext && typeof Worker !== 'undefined') {
            this._workersEnabled = true;
        } else {
            this._workersEnabled = false;
            // TODO - web workers unavailable, do something?
        }
    }

    public registerTranslatable(item: TranslatableDirective) {
        this._translatables.push(item);
    }

    public unregisterTranslatable(item: TranslatableDirective) {
        this._translatables = this._translatables.filter(t => t !== item);
    }

    public translateAll = (languageCode: string): void => {
        this.translating$.next(true);
        this._targetLanguage = languageCode;
        this._translatableQueue = [...this._translatables];
        this._translatingIndex = 0;
        this._doTranslations();
    }

    private _doTranslations = (): void => {
        if (this._translatableQueue.length === 0) {
            return;
        }

        // Don't run the translation pipeline for English
        if (this._targetLanguage === 'eng_Latn') {
            this._translatableQueue.forEach(translatable => {
                translatable.reset();
            });
            this.translating$.next(false);
            return;
        }

        if (!this._workersEnabled) {
            console.error('Web workers are not enabled');
            return;
        }

        // TODO - may not be feasible... but it would be great to have this spread across multiple workers to speed up translations
        this._workerService.requestWorker()
            .then(() => {
                this._translationWorker = new Worker(new URL('../@workers/translation.worker.ts', import.meta.url), { type: 'module' });
                this._translationWorker.onmessage = this._translationWorkerOnMessage;
                this._doNextTranslation();
            })
            .catch(error => {
                console.error('Web worker request denied. Unable to perform translations.', error);
            });
    }

    private _doNextTranslation = (): void => {
        if (this._translatableQueue.length === 0) {
            this._translationWorker.removeAllListeners?.();
            this._translationWorker.terminate();
            this._workerService.releaseWorker();
            this.translating$.next(false);
        } else {
            const translatable = this._translatableQueue.shift();
            if (translatable.currentLanguage === this._targetLanguage) {
                this._doNextTranslation();
            } else {
                translatable.currentLanguage = this._targetLanguage;
                translatable.translating$
                    .pipe(
                        skip(1),
                        takeWhile(value => value, true)
                    )
                    .subscribe(translating => {
                        if (!translating) {
                            this._translatingIndex++;
                            this._doNextTranslation();
                        }
                    });

                // To help reduce innaccuracies from translation chaining, always perform the translation from original language, English
                this._translationWorker.postMessage({
                    text: translatable.originalText,
                    sourceLanguage: 'eng_Latn',
                    targetLanguage: this._targetLanguage,
                    index: this._translatingIndex
                });
            }
        }
    }

    private _translationWorkerOnMessage = (event) => {
        let translatable: TranslatableDirective;

        switch (event.data.status) {
            // Pipeline messages
            case 'initiate':
                // Model file loading started, add model to array
                this.modelsLoading$.next(true);
                event.data.progress = 0;
                this.models = [...this.models, event.data];
                break;
            case 'progress':
                // Model file loading progress
                const model = this.models.find(m => m.file === event.data.file);
                model.progress = event.data.progress;
                break;
            case 'done':
                // Model file loading done, remove it from array
                this.models = this.models.filter(m => m.file !== event.data.file);
                break;
            case 'ready':
                // Pipeline ready, worker can now accept translate messages
                this.modelsLoading$.next(false);
                break;

            // Custom messages
            case 'translate-start':
                // Translation started
                translatable = this._translatables[event.data.index];
                translatable.translateStart();
                break;
            case 'translate-progress':
                // Translation progress
                translatable = this._translatables[event.data.index];
                translatable.translateProgress(event.data.output);
                break;
            case 'translate-done':
                // Translation done
                translatable = this._translatables[event.data.index];
                translatable.translateDone(event.data.output[0].translation_text);
                break;
        }
    };
}
