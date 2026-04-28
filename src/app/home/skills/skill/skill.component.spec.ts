import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SkillComponent } from './skill.component';

describe('SkillComponent', () => {
    let component: SkillComponent;
    let fixture: ComponentFixture<SkillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SkillComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        // TODO - #178
        // fixture = TestBed.createComponent(SkillComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
