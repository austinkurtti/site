import { OnInit, AfterViewInit, HostListener, Directive } from '@angular/core';
import { ColorService } from '@singletons/color.service';
import { SecretService } from '@singletons/secret.service';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, timer } from 'rxjs';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseComponent implements OnInit, AfterViewInit {
    public deferThreshold = .4;
    public backgroundDeferClass = '';
    public contentDeferClass = 'invisible';
    public colorClass = '';
    public colorClassLight = '';
    public colorClassDark = '';
    public title = '';

    protected animationsComplete$ = new BehaviorSubject<boolean>(false);

    private _animationsComplete = false;

    constructor(
        protected _colorService: ColorService,
        protected _secretService: SecretService
    ) {}

    @HostListener('window:resize') onResize = () => {
        if (this._animationsComplete) {
            this.windowResized();
        }
    };

    public ngOnInit() {
        this.colorClass = this._colorService.getRandomColorClass();
        this.colorClassLight = this.colorClass + '-light';
        this.colorClassDark = this.colorClass + '-dark';
        this._secretService.secretActivated$
            .pipe(filter(x => x))
            .subscribe(() => this.secretActivated());
    }

    public ngAfterViewInit() {
        timer(5050).subscribe(() => {
            this._animationsComplete = true;
            this.animationsComplete$.next(true);
        });
    }

    protected abstract windowResized(): void;

    protected abstract secretActivated(): void;
}
