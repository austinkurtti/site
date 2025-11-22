import { Component, input } from '@angular/core';
import { NewsflashDirective } from '@directives/newsflash/newsflash.directive';
import { WarshipsShip } from '../warships.models';

@Component({
    selector: 'ak-ship-newsflash',
    styleUrl: './ship-newsflash.component.scss',
    templateUrl: './ship-newsflash.component.html'
})
export class ShipNewsflashComponent extends NewsflashDirective {
    public ship = input<WarshipsShip>();
}
