import { Component, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, OnDestroy, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { timer, Subscription } from 'rxjs';

@Component({
    selector: 'ak-skill-carousel',
    templateUrl: './skill-carousel.component.html',
    styleUrls: ['./skill-carousel.component.scss']
})
export class SkillCarouselComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() skills: string[] = [];
    @Input() colorClass = '';
    @Input() autoScroll = false;

    @ViewChild('skillCarousel', { static: true }) skillCarousel: ElementRef;

    public leftIndex = 0;
    public rightIndex = 0;
    public numCarouselSkills = 6;
    public carouselSkills: string[] = [];

    private _autoScrollInterval = 5000; // 5 seconds
    private _autoScrollTimer: Subscription;
    private _autoScrollDebounce = false;

    constructor(
        private _renderer: Renderer2
    ) {}

    @HostListener('mouseover') onMouseOver = () => {
        this._stopAutoScrollTimer();
    };

    @HostListener('mouseout') onMouseOut = () => {
        this._startAutoScrollTimer();
    };

    public ngOnChanges(changes: SimpleChanges) {
        if ('autoScroll' in changes && changes.autoScroll.currentValue && !this._autoScrollTimer) {
            this._startAutoScrollTimer();
        }
    }

    public ngAfterViewInit() {
        this.rightIndex = this.numCarouselSkills - 1;
        for (let i = 0; i < this.numCarouselSkills; i++) {
            this._renderer.appendChild(this.skillCarousel.nativeElement, this._getNextSkill(i));
        }
    }

    public ngOnDestroy() {
        this._stopAutoScrollTimer();
    }

    public scrollCarousel(change: 'left' | 'right'): void {
        if (this._autoScrollDebounce) {
            return;
        }

        this._autoScrollDebounce = true;

        //TODO - DRY this up
        if (change === 'right') {
            // Update indexes
            this.leftIndex = this.leftIndex === this.skills.length - 1 ? 0 : this.leftIndex + 1;
            this.rightIndex = this.rightIndex === this.skills.length - 1 ? 0 : this.rightIndex + 1;

            // Animate unremoved skills to the left
            for (let i = 1; i < this.numCarouselSkills; i++) {
                const movingSkill = this.skillCarousel.nativeElement.children[i];
                this._renderer.addClass(movingSkill, 'move-left');
            }

            // Get removed skill
            const removedSkill = this.skillCarousel.nativeElement.children[0];
            this._renderer.addClass(removedSkill, 'shrink');

            // Append next skill
            const nextSkill = this._getNextSkill(this.rightIndex);
            this._renderer.addClass(nextSkill, 'grow');
            this._renderer.addClass(nextSkill, 'position-absolute');
            this._renderer.setStyle(nextSkill, 'right', '0%');
            this._renderer.appendChild(this.skillCarousel.nativeElement, nextSkill);

            // Clean up after animations have finished
            timer(250).subscribe(() => {
                // Remove animations
                for (let j = 1; j < this.numCarouselSkills; j++) {
                    const movedSkill = this.skillCarousel.nativeElement.children[j];
                    this._renderer.removeClass(movedSkill, 'move-left');
                }

                // Remove animation and absolute position from appended skill
                this._renderer.removeChild(this.skillCarousel.nativeElement, removedSkill);
                this._renderer.removeClass(nextSkill, 'grow');
                this._renderer.removeClass(nextSkill, 'position-absolute');
                this._renderer.removeStyle(nextSkill, 'right');
                this._autoScrollDebounce = false;
            });
        } else if (change === 'left') {
            // Update indexes
            this.leftIndex = this.leftIndex === 0 ? this.skills.length - 1 : this.leftIndex - 1;
            this.rightIndex = this.rightIndex === 0 ? this.skills.length - 1 : this.rightIndex - 1;

            // Animate unremoved skills to the right
            for (let i = 0; i < this.numCarouselSkills - 1; i++) {
                const movingSkill = this.skillCarousel.nativeElement.children[i];
                this._renderer.addClass(movingSkill, 'move-right');
            }

            // Get removed skill
            const removedSkill = this.skillCarousel.nativeElement.children[this.numCarouselSkills - 1];
            this._renderer.addClass(removedSkill, 'shrink');

            // Append next skill
            const nextSkill = this._getNextSkill(this.leftIndex);
            this._renderer.addClass(nextSkill, 'grow');
            this._renderer.addClass(nextSkill, 'position-absolute');
            this._renderer.setStyle(nextSkill, 'left', '0%');
            this._renderer.insertBefore(this.skillCarousel.nativeElement, nextSkill, this.skillCarousel.nativeElement.children[0]);

            // Clean up after animations have finished
            timer(250).subscribe(() => {
                // Remove animations
                for (let j = 1; j < this.numCarouselSkills; j++) {
                    const movedSkill = this.skillCarousel.nativeElement.children[j];
                    this._renderer.removeClass(movedSkill, 'move-right');
                }

                // Remove animation and absolute position from appended skill
                this._renderer.removeChild(this.skillCarousel.nativeElement, removedSkill);
                this._renderer.removeClass(nextSkill, 'grow');
                this._renderer.removeClass(nextSkill, 'position-absolute');
                this._renderer.removeStyle(nextSkill, 'left');
                this._autoScrollDebounce = false;
            });
        }
    }

    private _getNextSkill(nextSkillIndex: number): any {
        const newLi = this._renderer.createElement('li');
        this._renderer.setProperty(newLi, 'id', `skill-${nextSkillIndex}`);
        this._renderer.addClass(newLi, 'skill');
        this._renderer.addClass(newLi, 'col-2');
        const newI = this._renderer.createElement('i');
        this._renderer.addClass(newI, this.skills[nextSkillIndex]);
        this._renderer.addClass(newI, this.colorClass);
        this._renderer.appendChild(newLi, newI);
        return newLi;
    }

    private _startAutoScrollTimer(): void {
        this._autoScrollTimer = timer(this._autoScrollInterval, this._autoScrollInterval).subscribe(() => {
            this.scrollCarousel('right');
        });
    }

    private _stopAutoScrollTimer(): void {
        if (this._autoScrollTimer) {
            this._autoScrollTimer.unsubscribe();
            this._autoScrollTimer = null;
        }
    }
}
