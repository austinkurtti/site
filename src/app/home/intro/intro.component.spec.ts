import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
    let component: IntroComponent;
    let fixture: ComponentFixture<IntroComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                IntroComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
