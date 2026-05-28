import { AfterViewInit, Directive, ElementRef, inject, viewChild } from '@angular/core';
import { NewsflashService } from '@services/newsflash.service';

@Directive()
export class NewsflashDirective implements AfterViewInit {
    public staticContentEl = viewChild<ElementRef>('staticContent');
    public movingContentEl = viewChild<ElementRef>('movingContent');

    public elementRef = inject(ElementRef);

    protected newsflashService = inject(NewsflashService);

    public ngAfterViewInit(): void {
        this.newsflashService.initNewsflashFocus();
    }
}
