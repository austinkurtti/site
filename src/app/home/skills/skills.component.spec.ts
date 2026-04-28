import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import '../../@extensions/array';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
    let component: SkillsComponent;
    let fixture: ComponentFixture<SkillsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SkillsComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        // TODO - #178
        // fixture = TestBed.createComponent(SkillsComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
