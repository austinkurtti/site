import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContactIconsComponent } from './contact-icons.component';

describe('ContactIconsComponent', () => {
    let component: ContactIconsComponent;
    let fixture: ComponentFixture<ContactIconsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ContactIconsComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactIconsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
