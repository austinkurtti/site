import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CareerComponent } from './career.component';

describe('CareerComponent', () => {
    let component: CareerComponent;
    let fixture: ComponentFixture<CareerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CareerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CareerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
