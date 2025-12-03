import { Injectable, RendererFactory2, inject } from '@angular/core';
import { getRandomInteger } from '@functions/rng';
import { EffectParticle } from '@models/effect.model';
import { interval, timer } from 'rxjs';
import { delay, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EffectsService {
    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    // TODO - refactor this with pure CSS
    public confettiBurst(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): void {
        const particles: EffectParticle[] = [];
        const particleEls: any[] = [];
        const numParticles = 40;
        const effectsEl = document.querySelector('#ak-effects-container');

        for (let i = 0; i < numParticles; i++) {
            const particle = this._createParticle(
                ['red', 'orange', 'yellow', 'green', 'sky', 'blue', 'purple'],
                ['circle', 'certificate', 'square']
            );
            // Random direction from center between 0 - 360 degrees
            particle.direction = Math.floor(Math.random() * 360);
            // Random (clockwise or counterclockwise) angular speed between 10 - 50 degrees per frame
            particle.angularSpeed = Math.floor(Math.random() * (50 - 10) + 10) * (Math.floor(Math.random() * 2) === 0 ? 1 : -1);
            particle.linearSpeed = 40;
            particle.x = xCenter;
            particle.y = yCenter;
            particle.opacity = 1;
            // Random starting rotational position
            particle.rotation = Math.floor(Math.random() * 360);
            // Random rotational axis
            particle.rotationAxis = [Math.random(), Math.random(), Math.random()];
            particles.push(particle);

            const particleEl = this._createParticleEl(particle, 'confetti');
            this._renderer.setStyle(particleEl, 'left', `${particle.x}px`);
            this._renderer.setStyle(particleEl, 'top', `${particle.y}px`);
            this._renderer.setStyle(
                particleEl,
                'transform',
                `rotate3d(${particle.rotationAxis[0]}, ${particle.rotationAxis[1]}, ${particle.rotationAxis[2]}, ${particle.rotation}deg)`
            );
            particleEls.push(particleEl);
            this._renderer.appendChild(effectsEl, particleEl);
        }

        interval(50).pipe(take(18)).subscribe({
            next: frame => {
                for (let i = 0; i < numParticles; i++) {
                    // Calculate particle position changes
                    const particle = particles[i];
                    const xDelta = Math.sin(particle.direction % 90) * particle.linearSpeed;
                    const yDelta = Math.cos(particle.direction % 90) * particle.linearSpeed;
                    if (particle.direction <= 90) {
                        // Up and right
                        particle.x += xDelta;
                        particle.y -= yDelta;
                    } else if (particle.direction <= 180) {
                        // Down and right
                        particle.x += xDelta;
                        particle.y += yDelta;
                    } else if (particle.direction <= 270) {
                        // Down and left
                        particle.x -= xDelta;
                        particle.y += yDelta;
                    } else {
                        // Up and left
                        particle.x -= xDelta;
                        particle.y -= yDelta;
                    }
                    // Clamp
                    particle.x = particle.x.bounded(25, document.body.clientWidth - 25);
                    particle.y = particle.y.bounded(25, document.body.clientHeight - 25);
                    particle.rotation = particle.rotation + particle.angularSpeed;

                    // Randomize angular speed change between 80% - 100% original
                    particle.angularSpeed = particle.angularSpeed * (Math.random() * (100 - 80) + 80) / 100;
                    // Randomize linear speed change between 40% - 100% original
                    particle.linearSpeed = particle.linearSpeed * (Math.random() * (100 - 40) + 40) / 100;

                    if (frame > 10) {
                        particle.opacity -= .1;
                    }

                    // Update particle element
                    const particleEl = particleEls[i];
                    this._renderer.setStyle(particleEl, 'left', `${particle.x}px`);
                    this._renderer.setStyle(particleEl, 'top', `${particle.y}px`);
                    this._renderer.setStyle(
                        particleEl,
                        'transform',
                        `rotate3d(${particle.rotationAxis[0]}, ${particle.rotationAxis[1]}, ${particle.rotationAxis[2]}, ${particle.rotation}deg)`
                    );
                    this._renderer.setStyle(particleEl, 'opacity', particle.opacity);
                };
            },
            complete: () => {
                particleEls.forEach(el => {
                    this._renderer.removeChild(effectsEl, el);
                });
            }
        });
    }

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

    // TODO - refactor this with pure CSS
    public explosion(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const effectsEl = document.querySelector('#ak-effects-container');
            if (!effectsEl) {
                reject('Cannot find effects container');
            }

            const particles: EffectParticle[] = [];
            const particleEls: any[] = [];
            const numParticles = 50;

            for (let i = 0; i < numParticles; i++) {
                const particle = this._createParticle(
                    ['red', 'orange', 'yellow', 'black'],
                    ['circle', 'certificate', 'star', 'square', 'play']
                );
                // Full 360deg spread
                particle.direction = Math.random() * 360;
                // High initial speed
                particle.linearSpeed = 20 + Math.random() * 30;
                particle.angularSpeed = Math.random() * 20 - 10;
                particle.x = xCenter;
                particle.y = yCenter;
                particle.opacity = 1;
                // Random starting rotational position
                particle.rotation = Math.floor(Math.random() * 360);
                // Random rotational axis
                particle.rotationAxis = [Math.random(), Math.random(), Math.random()];
                particles.push(particle);

                const particleEl = this._createParticleEl(particle, 'explosion');
                this._renderer.setStyle(particleEl, 'left', `${particle.x}px`);
                this._renderer.setStyle(particleEl, 'top', `${particle.y}px`);
                this._renderer.setStyle(
                    particleEl,
                    'transform',
                    `rotate3d(${particle.rotationAxis[0]}, ${particle.rotationAxis[1]}, ${particle.rotationAxis[2]}, ${particle.rotation}deg)`
                );
                particleEls.push(particleEl);
                this._renderer.appendChild(effectsEl, particleEl);
            }

            interval(50).pipe(take(25)).subscribe({
                next: frame => {
                    for (let i = 0; i < numParticles; i++) {
                        const particle = particles[i];
                        // Convert direction to radians
                        const rad = (particle.direction * Math.PI) / 180;
                        // Outward movement
                        particle.x += Math.cos(rad) * particle.linearSpeed;
                        particle.y += Math.sin(rad) * particle.linearSpeed;
                        // Clamp
                        particle.x = particle.x.bounded(25, document.body.clientWidth - 25);
                        particle.y = particle.y.bounded(25, document.body.clientHeight - 25);
                        // Simulate drag/air resistence
                        particle.linearSpeed *= .9;
                        // Spin
                        particle.rotation += particle.angularSpeed;
                        // Fade out
                        if (frame > 15) {
                            particle.opacity -= .05;
                        }

                        // Update particle element
                        const particleEl = particleEls[i];
                        this._renderer.setStyle(particleEl, 'left', `${particle.x}px`);
                        this._renderer.setStyle(particleEl, 'top', `${particle.y}px`);
                        this._renderer.setStyle(
                            particleEl,
                            'transform',
                            `rotate3d(${particle.rotationAxis[0]}, ${particle.rotationAxis[1]}, ${particle.rotationAxis[2]}, ${particle.rotation}deg)`
                        );
                        this._renderer.setStyle(particleEl, 'opacity', particle.opacity);
                    }
                },
                complete: () => {
                    particleEls.forEach(el => {
                        this._renderer.removeChild(effectsEl, el);
                    });
                    resolve();
                }
            });
        });
    }

    public fireworks(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const effectsEl = document.querySelector('#ak-effects-container');
            if (!effectsEl) {
                reject('Cannot find effects container');
                return;
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

    private _launchSingleFirework(effectsEl: Element): Promise<void> {
        return new Promise<void>((resolve) => {
            const vw = Math.random().bounded(.2, .8) * 100;
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

    private _createParticle(colorOptions: string[], shapeOptions: string[]): EffectParticle {
        const particle = new EffectParticle({
            color: this._randomColor(colorOptions),
            shape: this._randomShape(shapeOptions)
        });
        return particle;
    }

    private _createParticleEl(particle: EffectParticle, effectClass: string): any {
        const particleEl = this._renderer.createElement('div');
        this._renderer.addClass(particleEl, effectClass);
        this._renderer.addClass(particleEl, particle.color);
        this._renderer.addClass(particleEl, 'fas');
        this._renderer.addClass(particleEl, particle.shape);
        return particleEl;
    }

    private _randomColor(colorOptions: string[]): string {
        const random = Math.floor(Math.random() * colorOptions.length);
        return colorOptions[random];
    }

    private _randomShape(shapeOptions: string[]): string {
        const random = Math.floor(Math.random() * shapeOptions.length);
        return `fa-${shapeOptions[random]}`;
    }
}
