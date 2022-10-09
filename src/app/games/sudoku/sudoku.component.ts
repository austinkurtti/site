import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { SudokuBoard } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements AfterViewInit {
    @ViewChild('sudokuContent') contentEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public board = new SudokuBoard();

    constructor(
        private _renderer: Renderer2
    ) {}

    public ngAfterViewInit(): void {
        const contentHeight = this.contentEl.nativeElement.clientHeight;
        const contentWidth = this.contentEl.nativeElement.clientWidth;
        const size = contentWidth > contentHeight
            ? contentHeight * 0.9 // Landscape viewport - constrain by height
            : contentWidth * 0.9; // Portrait viewport - constrain by width

        this._renderer.setStyle(this.boardEl.nativeElement, 'height', size + 'px');
        this._renderer.setStyle(this.boardEl.nativeElement, 'width', size + 'px');
    }

    public cellKeydown(squareIndex: number, cellIndex: number, event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                this._focusNextCell(
                    squareIndex,
                    cellIndex,
                    (index) => index < 3,
                    (index) => index < 3,
                    (index) => index - 3,
                    (index) => index + 6
                );
                break;
            case 'ArrowDown':
                this._focusNextCell(
                    squareIndex,
                    cellIndex,
                    (index) => index >= 6,
                    (index) => index >= 6,
                    (index) => index + 3,
                    (index) => index - 6
                );
                break;
            case 'ArrowLeft':
                this._focusNextCell(
                    squareIndex,
                    cellIndex,
                    (index) => [0, 3, 6].includes(index),
                    (index) => [0, 3, 6].includes(index),
                    (index) => index - 1,
                    (index) => index + 2
                );
                break;
            case 'ArrowRight':
                this._focusNextCell(
                    squareIndex,
                    cellIndex,
                    (index) => [2, 5, 8].includes(index),
                    (index) => [2, 5, 8].includes(index),
                    (index) => index + 1,
                    (index) => index - 2
                );
                break;
            case 'Backspace':
            case 'Delete':
                this.board.squares[squareIndex].cells[cellIndex].value = void 0;
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
                this.board.squares[squareIndex].cells[cellIndex].value = +event.key;
                break;
            default:
                return;
        }

        event.preventDefault();
    }

    private _focusNextCell(
        squareIndex: number,
        cellIndex: number,
        boardEdgePredicate: (index: number) => boolean,
        squareEdgePredicate: (index: number) => boolean,
        squareIndexModifier: (index: number) => number,
        cellIndexModifier: (index: number) => number
    ): void {
        const onBoardEge = boardEdgePredicate(squareIndex);
        const onSquareEdge = squareEdgePredicate(cellIndex);
        const nextSquareIndex = !onBoardEge && onSquareEdge
            ? squareIndexModifier(squareIndex)
            : squareIndex;
        const nextCellIndex = !onBoardEge && onSquareEdge
            ? cellIndexModifier(cellIndex)
            : onBoardEge && onSquareEdge
                ? cellIndex
                : squareIndexModifier(cellIndex);
        (document.querySelector('#cell-' + nextSquareIndex + '-' + nextCellIndex) as HTMLElement).focus();
    }
}
