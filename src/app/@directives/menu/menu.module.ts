import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MenuContentDirective } from './menu-content.directive';
import { MenuItemDirective } from './menu-item.directive';
import { MenuDirective } from './menu.directive';

@NgModule({
    declarations: [
        MenuContentDirective,
        MenuDirective,
        MenuItemDirective
    ],
    exports: [
        MenuContentDirective,
        MenuDirective,
        MenuItemDirective
    ],
    imports: [
        CommonModule
    ]
})
export class MenuDirectiveModule {}
