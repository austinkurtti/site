import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProjectComponent } from './project.component';

describe('ProjectComponent', () => {
    let component: ProjectComponent;
    let fixture: ComponentFixture<ProjectComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                ProjectComponent
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
        fixture = TestBed.createComponent(ProjectComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.componentRef.setInput('name', 'Project 1');
        fixture.componentRef.setInput('icon', 'fas fa-square');
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });
});
