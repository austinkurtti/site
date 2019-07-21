import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillCarouselComponent } from './skill-carousel.component';

describe('SkillCarouselComponent', () => {
    let component: SkillCarouselComponent;
    let fixture: ComponentFixture<SkillCarouselComponent>;

    beforeEach(async(() => {
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
