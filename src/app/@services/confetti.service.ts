import { Injectable, RendererFactory2, inject } from '@angular/core';
import { ConfettiParticle } from '@models/confetti.model';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfettiService {
    private _renderer = inject(RendererFactory2).createRenderer(null, null);

    public burst(xCenter: number = document.body.clientWidth / 2, yCenter: number = document.body.clientHeight / 2): void {
        const particles: ConfettiParticle[] = [];
        const particleEls: any[] = [];
        const numParticles = 40;
        const appRootEl = document.querySelector('ak-app-root');
        for (let i = 0; i < numParticles; i++) {
            const particle = this._createParticle();
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

            const particleEl = this._createParticleEl(particle);
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

    private _createParticle(): ConfettiParticle {
        const particle = new ConfettiParticle({
            color: this._randomColor(),
            shape: this._randomShape()
        });
        return particle;
    }

    private _createParticleEl(particle: ConfettiParticle): any {
        const particleEl = this._renderer.createElement('div');
        this._renderer.addClass(particleEl, 'confetti');
        this._renderer.addClass(particleEl, particle.color);
        this._renderer.addClass(particleEl, 'fas');
        this._renderer.addClass(particleEl, particle.shape);
        return particleEl;
    }

    private _randomColor(): string {
        const random = Math.floor(Math.random() * 7);
        return ['red', 'orange', 'yellow', 'green', 'sky', 'blue', 'purple'][random];
    }

    private _randomShape(): string {
        const random = Math.floor(Math.random() * 3);
        return `fa-${['circle', 'certificate', 'square'][random]}`;
    }
}
