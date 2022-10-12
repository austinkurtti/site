import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { SudokuBoard, SudokuDifficulty } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements OnInit, AfterViewInit {
    @ViewChild('sudokuContent') contentEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public board = new SudokuBoard();

    constructor(
        private _renderer: Renderer2
    ) {}

    public ngOnInit(): void {
        this.board.prime(SudokuDifficulty.easy);
    }

    public ngAfterViewInit(): void {
        const contentHeight = this.contentEl.nativeElement.clientHeight;
        const contentWidth = this.contentEl.nativeElement.clientWidth;
        const size = contentWidth > contentHeight
            ? contentHeight * 0.9 // Landscape viewport - constrain by height
            : contentWidth * 0.9; // Portrait viewport - constrain by width

        this._renderer.setStyle(this.boardEl.nativeElement, 'height', size + 'px');
        this._renderer.setStyle(this.boardEl.nativeElement, 'width', size + 'px');
    }

    public cellKeydown(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                this._focusNextCell(rowIndex - 1, colIndex);
                break;
            case 'ArrowDown':
                this._focusNextCell(rowIndex + 1, colIndex);
                break;
            case 'ArrowLeft':
                this._focusNextCell(rowIndex, colIndex - 1);
                break;
            case 'ArrowRight':
                this._focusNextCell(rowIndex, colIndex + 1);
                break;
            case 'Backspace':
            case 'Delete':
                this.board.cells[rowIndex][colIndex].value = null;
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.board.cells[rowIndex][colIndex].value = +event.key;
                break;
            default:
                return;
        }

        event.preventDefault();
    }

    private _focusNextCell(rowIndex: number, colIndex: number): void {
        const nextRowIndex = rowIndex < 0 ? 0 : rowIndex > 8 ? 8 : rowIndex;
        const nextColIndex = colIndex < 0 ? 0 : colIndex > 8 ? 8 : colIndex;
        (document.querySelector(`#cell-${nextRowIndex}-${nextColIndex}`) as HTMLElement).focus();
    }
}
