import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '@services/translation.service';
import { SelectComponent, SelectOption } from "../select/select.component";

@Component({
    selector: 'ak-translations',
    styleUrls: ['./translations.component.scss'],
    templateUrl: './translations.component.html',
    imports: [
        CommonModule,
        FormsModule,
        SelectComponent
    ]
})
export class TranslationsComponent implements OnInit {
    @HostBinding('class') classes = 'd-block p-3';

    public translationService = inject(TranslationService);

    public selectedLanguage: string;
    // https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200
    public languageOptions = [
        new SelectOption<string>('Deutsch',     'deu_Latn'), // German
        new SelectOption<string>('English',     'eng_Latn'), // English
        new SelectOption<string>('Español',     'spa_Latn'), // Spanish
        new SelectOption<string>('Français',    'fra_Latn'), // French
        new SelectOption<string>('Português',   'por_Latn'), // Portuguese
    ];

    public ngOnInit(): void {
        this.selectedLanguage = this.languageOptions[0].value;
    }

    public translate(): void {
        this.translationService.translateAll(this.selectedLanguage);
    }
}
