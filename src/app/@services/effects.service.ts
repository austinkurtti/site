import { Injectable, RendererFactory2, inject } from '@angular/core';
import { EffectParticle } from '@models/effect.model';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EffectsService {
    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    public confettiBurst(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): void {
        const particles: EffectParticle[] = [];
        const particleEls: any[] = [];
        const numParticles = 40;
        const appRootEl = document.querySelector('ak-app-root');

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
            this._renderer.appendChild(appRootEl, particleEl);
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
                    this._renderer.removeChild(appRootEl, el);
                });
            }
        });
    }

    public splash(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): void {
        const particles: EffectParticle[] = [];
        const particleEls: any[] = [];
        const numParticles = 40;
        const appRootEl = document.querySelector('ak-app-root');

        for (let i = 0; i < numParticles; i++) {
            const particle = this._createParticle(
                ['sky', 'blue'],
                ['tint']
            );
            // Random upward direction from center
            particle.direction = -120 + (60 * i) / (numParticles - 1);
            particle.linearSpeed = 5 + Math.random() * 20;
            particle.angularSpeed = Math.random() * 10 - 5;
            particle.x = xCenter;
            particle.y = yCenter;
            particle.opacity = 1;
            // Random starting rotational position
            particle.rotation = Math.floor(Math.random() * 360);
            // Random rotational axis
            particle.rotationAxis = [Math.random(), Math.random(), Math.random()];
            particles.push(particle);

            const particleEl = this._createParticleEl(particle, 'splash');
            this._renderer.setStyle(particleEl, 'left', `${particle.x}px`);
            this._renderer.setStyle(particleEl, 'top', `${particle.y}px`);
            this._renderer.setStyle(
                particleEl,
                'transform',
                `rotate3d(${particle.rotationAxis[0]}, ${particle.rotationAxis[1]}, ${particle.rotationAxis[2]}, ${particle.rotation}deg)`
            );
            particleEls.push(particleEl);
            this._renderer.appendChild(appRootEl, particleEl);
        }

        let gravity = 2.5;
        interval(50).pipe(take(25)).subscribe({
            next: frame => {
                for (let i = 0; i < numParticles; i++) {
                    const particle = particles[i];
                    // Convert direction to radians
                    const rad = (particle.direction * Math.PI) / 180;
                    // Move outward
                    particle.x += Math.cos(rad) * particle.linearSpeed;
                    particle.y += Math.sin(rad) * particle.linearSpeed;
                    // Clamp
                    particle.x = particle.x.bounded(25, document.body.clientWidth - 25);
                    particle.y = particle.y.bounded(25, document.body.clientHeight - 25);
                    // Apply gravity (downward)
                    particle.y += gravity * frame * .15;
                    // Slow down horizontal speed (simulate drag)
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
                    this._renderer.removeChild(appRootEl, el);
                });
            }
        });
    }

    public explosion(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): void {
        const particles: EffectParticle[] = [];
        const particleEls: any[] = [];
        const numParticles = 50;
        const appRootEl = document.querySelector('ak-app-root');

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
            this._renderer.appendChild(appRootEl, particleEl);
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
                    this._renderer.removeChild(appRootEl, el);
                });
            }
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
