import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                AboutComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {}
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
