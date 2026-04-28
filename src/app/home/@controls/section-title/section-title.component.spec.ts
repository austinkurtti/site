import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SectionTitleComponent } from './section-title.component';

describe('SectionTitleComponent', () => {
    let component: SectionTitleComponent;
    let fixture: ComponentFixture<SectionTitleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SectionTitleComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionTitleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
