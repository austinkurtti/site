import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SkillComponent } from './skill.component';

describe('SkillComponent', () => {
    let component: SkillComponent;
    let fixture: ComponentFixture<SkillComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                SkillComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
