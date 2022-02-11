import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContactIconsComponent } from './contact-icons.component';

describe('ContactIconsComponent', () => {
    let component: ContactIconsComponent;
    let fixture: ComponentFixture<ContactIconsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ContactIconsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactIconsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
