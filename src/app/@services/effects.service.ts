import { Injectable, RendererFactory2, inject } from '@angular/core';
import { getRandomInteger } from '@functions/rng';
import { interval, timer } from 'rxjs';
import { delay, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EffectsService {
    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    public ripple(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const effectsEl = document.querySelector('#ak-effects-container');
            if (!effectsEl) {
                reject('Cannot find effects container');
            }

            const rippleCount = 3;
            const rippleEls: any[] = [];
            const rippleStates = Array(rippleCount).fill(false);
            // Create ripples
            for (let i = 0; i < rippleCount; i++) {
                const rippleEl = this._renderer.createElement('div');
                this._renderer.addClass(rippleEl, 'ripple');
                this._renderer.setStyle(rippleEl, 'left', `${xCenter - 50}px`);
                this._renderer.setStyle(rippleEl, 'top', `${yCenter - 50}px`);
                this._renderer.appendChild(effectsEl, rippleEl);
                rippleEls.push(rippleEl);
            }

            const totalFrames = 24; // ~1440ms at 60ms interval
            const rippleDelays = [0, 2, 6];
            const scales = [.6, .8, 1];
            const maxScale = 1.6;
            interval(60).pipe(take(totalFrames + Math.max(...rippleDelays))).subscribe({
                next: frame => {
                    for (let i = 0; i < rippleCount; i++) {
                        if (!rippleStates[i] && frame >= rippleDelays[i]) {
                            // Start animating this ripple
                            rippleStates[i] = true;
                            this._renderer.setStyle(rippleEls[i], 'opacity', '1');
                            this._renderer.setStyle(rippleEls[i], 'transform', `scale(${scales[i]})`);
                        }
                        // Animate scale and opacity
                        if (rippleStates[i]) {
                            // Progress from initial scale to maxScale
                            const progress = Math.min(1, (frame - rippleDelays[i]) / (totalFrames - rippleDelays[i]));
                            const scale = scales[i] + (maxScale - scales[i]) * progress;
                            const opacity = 1 - progress;
                            this._renderer.setStyle(rippleEls[i], 'opacity', `${opacity}`);
                            this._renderer.setStyle(rippleEls[i], 'transform', `scale(${scale})`);
                        }
                    }
                },
                complete: () => {
                    rippleEls.forEach(rippleEl => {
                        this._renderer.removeChild(effectsEl, rippleEl);
                    });
                    resolve();
                }
            });
        });
    }

    public explosion(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const effectsEl = document.querySelector('#ak-effects-container');
            if (!effectsEl) {
                reject('Cannot find effects container');
            }

            const duration = 1000; // 1s - sync this with .explosion animation-duration
            const explosion = this._renderer.createElement('div');
            this._renderer.addClass(explosion, 'explosion');
            this._renderer.setStyle(explosion, 'left', `${xCenter}px`);
            this._renderer.setStyle(explosion, 'top', `${yCenter}px`);
            this._renderer.setStyle(explosion, 'transform', `translate(-50%, -50%) rotate(${getRandomInteger(0, 360)}deg)`);
            this._renderer.appendChild(effectsEl, explosion);

            timer(duration).subscribe(() => {
                this._renderer.removeChild(effectsEl, explosion);
                resolve();
            });
        });
    }

    public fireworks(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const effectsEl = document.querySelector('#ak-effects-container');
            if (!effectsEl) {
                reject('Cannot find effects container');
            }

            const fireworkCount = 18;
            interval(200).pipe(take(fireworkCount)).subscribe({
                next: () => {
                    this._launchSingleFirework(effectsEl);
                },
                complete: () => resolve()
            });
        });
    }

    public typeText(element: HTMLElement): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!element.innerText) {
                reject('No text available to type out');
            }

            const originalText = element.innerText;
            element.innerText = '█';
            interval(150).pipe(
                delay(250),
                take(originalText.length)
            ).subscribe({
                next: frame => {
                    element.innerText = `${originalText.slice(0, frame + 1)}█`;
                },
                complete: () => {
                    element.innerText = originalText;
                    resolve();
                }
            });
        });
    }

    private _randomColor(colorOptions: string[]): string {
        const random = Math.floor(Math.random() * colorOptions.length);
        return colorOptions[random];
    }

    private _launchSingleFirework(effectsEl: Element): Promise<void> {
        return new Promise<void>((resolve) => {
            const duration = 2000; // 2s - sync this with .firework animation-duration

            // Set randomized firework styles
            const firework = this._renderer.createElement('div');
            this._renderer.addClass(firework, 'firework');
            this._renderer.addClass(firework, this._randomColor(['multi', 'red', 'green', 'blue', 'purple']));
            this._renderer.setProperty(firework, 'style', `
                --firework-x: ${getRandomInteger(0, 15) * (Math.floor(Math.random() * 2) === 0 ? 1 : -1)}vw;
                --firework-y: ${getRandomInteger(0, 10) * (Math.floor(Math.random() * 2) === 0 ? 1 : -1)}vh;
                left: ${getRandomInteger(10, 90)}%;
                top: ${getRandomInteger(10, 35)}%;
            `);
            this._renderer.appendChild(effectsEl, firework);

            timer(duration).subscribe(() => {
                this._renderer.removeChild(effectsEl, firework);
                resolve();
            });
        });
    }
}
