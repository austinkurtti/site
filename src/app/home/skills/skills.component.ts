import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { skillsId, skillsText } from '@constants/strings';
import { Subscription, timer } from 'rxjs';
import { DeferLoadDirective } from '../../@directives/defer-load/defer-load.directive';
import { SectionTitleComponent } from '../@controls/section-title/section-title.component';
import { SectionDirective } from '../@controls/section/section.directive';
import { SkillComponent } from './skill/skill.component';
import { skills, SkillType } from './skills.models';

@Component({
    selector: 'ak-skills',
    styleUrls: ['./skills.component.scss'],
    templateUrl: './skills.component.html',
    imports: [
        DeferLoadDirective,
        SectionTitleComponent,
        SkillComponent
    ]
})
export class SkillsComponent extends SectionDirective implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('skillsCarousel', { read: ElementRef, static: true }) skillsCarousel!: ElementRef;

    public navigationId = skillsId;
    public title = skillsText;
    public skills = skills;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SkillType = SkillType;

    private _changeDetectorRef = inject(ChangeDetectorRef);

    private _shiftTimer: Subscription | null = null;
    private _translateTimer: Subscription | null = null;

    public ngOnInit(): void {
        this.skills.shuffle();
    }

    public ngAfterViewInit(): void {
        this._startTranslateTimer();
        document.addEventListener('visibilitychange', this._documentVisibilitychange);
    }

    public ngOnDestroy(): void {
        this._cancelShiftTimer();
        this._cancelTranslateTimer();
        document.removeEventListener('visibilitychange', this._documentVisibilitychange);
    }

    public mouseover() {
        this._cancelShiftTimer();
        this._cancelTranslateTimer();
    }

    public mouseout() {
        this._startTranslateTimer();
    }

    private _startShiftTimer = (): void => {
        this._cancelShiftTimer();
        this._shiftTimer = timer(1000).subscribe(() => {
            // Shift the skill at the front of the carousel to the back
            const firstSkill = this.skills.shift();
            this.skills.push(firstSkill!);

            // Clear out transforms
            for (const skill of this.skillsCarousel.nativeElement.children) {
                this._renderer.setStyle(skill, 'transform', 'none');
                this._renderer.setStyle(skill, 'transition', 'none');
            }

            this._startTranslateTimer();
        });
    };

    private _startTranslateTimer = (): void => {
        this._cancelTranslateTimer();
        this._changeDetectorRef.markForCheck();
        this._translateTimer = timer(3000).subscribe(() => {
            // Add transforms to all the skills so they "rotate" on the carousel
            for (const skill of this.skillsCarousel.nativeElement.children) {
                this._renderer.setStyle(skill, 'transform', 'translateX(-100%)');
                this._renderer.setStyle(skill, 'transition', 'ease-in-out transform 1s');
            }

            this._startShiftTimer();
        });
    };

    private _cancelShiftTimer = (): void => {
        this._shiftTimer?.unsubscribe();
        this._shiftTimer = null;
    };

    private _cancelTranslateTimer = (): void => {
        this._translateTimer?.unsubscribe();
        this._translateTimer = null;
    };

    private _documentVisibilitychange = (event: Event): void => {
        if (document.visibilityState === 'hidden') {
            this._cancelShiftTimer();
            this._cancelTranslateTimer();
        } else if (document.visibilityState === 'visible') {
            this._startTranslateTimer();
        }
    };
}
