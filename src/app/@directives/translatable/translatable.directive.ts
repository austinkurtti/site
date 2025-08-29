import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { BehaviorSubject } from 'rxjs';

@Directive({
    selector: '[akTranslatable]'
})
export class TranslatableDirective implements OnInit, AfterViewInit, OnDestroy {
    public elementRef = inject(ElementRef);

    public originalText = '';

    public translating$ = new BehaviorSubject<boolean>(false);

    private _renderer = inject(Renderer2);
    private _translationService = inject(TranslationService);

    private _translation: string;
    private _preservedDisplay: string;
    private _preservedHeight: string;
    private _preservedWidth: string;
    private _inlineElementTagNames = ['A', 'STRONG', 'EM', 'B', 'I', 'Q', 'MARK', 'SPAN'];

    public ngOnInit(): void {
        this._translationService.registerTranslatable(this);
    }

    public ngAfterViewInit(): void {
        this.originalText = this.elementRef.nativeElement.innerText;
    }

    public ngOnDestroy(): void {
        this._translationService.unregisterTranslatable(this);
    }

    public translateStart(): void {
        this.translating$.next(true);

        // Freeze the element dimensions to prevent jankiness during translation
        this._preservedDisplay = this.elementRef.nativeElement.style.display;
        this._preservedHeight = this.elementRef.nativeElement.style.height;
        this._preservedWidth = this.elementRef.nativeElement.style.width;
        if (this._inlineElementTagNames.includes(this.elementRef.nativeElement.tagName)) {
            this._renderer.setStyle(this.elementRef.nativeElement, 'display', 'inline-block');
        }
        this._renderer.setStyle(this.elementRef.nativeElement, 'height', this.elementRef.nativeElement.clientHeight + 'px');
        this._renderer.setStyle(this.elementRef.nativeElement, 'width', this.elementRef.nativeElement.clientWidth + 'px');
        this._renderer.addClass(this.elementRef.nativeElement, 'translating');

        // Reset translation to empty string
        this._translation = '';
        this._setInnerText();
    }

    public translateProgress(translation: string): void {
        this._translation += translation;
        this._setInnerText();
    }

    public translateDone(finalTranslation: string): void {
        this._translation = finalTranslation;
        this._setInnerText();
        this._renderer.removeClass(this.elementRef.nativeElement, 'translating');
        this._renderer.setStyle(this.elementRef.nativeElement, 'display', this._preservedDisplay);
        this._renderer.setStyle(this.elementRef.nativeElement, 'height', this._preservedHeight);
        this._renderer.setStyle(this.elementRef.nativeElement, 'width', this._preservedWidth);

        this.translating$.next(false);
    }

    private _setInnerText(): void {
        this._renderer.setProperty(this.elementRef.nativeElement, 'innerText', this._translation);
    }
}
