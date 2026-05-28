import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
    let component: ProjectsComponent;
    let fixture: ComponentFixture<ProjectsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ProjectsComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {}
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
