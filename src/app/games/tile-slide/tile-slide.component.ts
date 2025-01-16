import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TooltipDirective } from '@directives/tooltip/tooltip.directive';

@Component({
    standalone: true,
    selector: 'ak-tile-slide',
    styleUrls: ['./tile-slide.component.scss'],
    templateUrl: './tile-slide.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        TooltipDirective
    ]
})
export class TileSlideComponent implements OnInit {
    public gridHeight = 4; // TODO - make dynamic
    public gridWidth = 4; // TODO - make dynamic
    public numbers: number[][];

    public ngOnInit(): void {
        // Clear out numbers
        this.numbers = [...new Array(this.gridHeight)].map(() => [...new Array(this.gridWidth)]);

        // Generate randomized numbers
        // TODO - prng shuffle
        const randomizedNums = [];
        for (let i = 1; i < this.gridHeight * this.gridWidth; i++) {
            randomizedNums.push(i);
        }
        randomizedNums.shuffle();

        // Fill grid with randomized numbers
        this.numbers.forEach(row => {
            for (let i = 0; i < this.gridWidth; i++) {
                row[i] = randomizedNums.shift();
            }
        });
    }

    public back(): void {
        // TODO
    }

    public showHelpDialog(): void {
        // TODO
    }
}
