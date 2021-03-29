import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SkillCarouselComponent } from './skill-carousel.component';

describe('SkillCarouselComponent', () => {
    let component: SkillCarouselComponent;
    let fixture: ComponentFixture<SkillCarouselComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SkillCarouselComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkillCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
