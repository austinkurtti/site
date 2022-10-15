import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SudokuBoard, SudokuDifficulty, SudokuState } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('sudokuContent') contentEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public board = new SudokuBoard();
    public difficulty = SudokuDifficulty.easy;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuDifficulty = SudokuDifficulty;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuState = SudokuState;

    public building$ = new BehaviorSubject<boolean>(false);
    public boardSize$ = new BehaviorSubject<number>(0);
    public time$ = new BehaviorSubject<string>('00:00:00');

    private _timerId;
    private _startTime: number;
    private _pauseTime: number;
    private _pauseSum: number;

    private _destroyed$ = new Subject<void>();

    constructor(
        private _renderer: Renderer2
    ) {}

    public ngOnInit(): void {
        this.boardSize$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(size => {
                if (size && this.boardEl) {
                    this._renderer.setStyle(this.boardEl.nativeElement, 'height', `${size}px`);
                    this._renderer.setStyle(this.boardEl.nativeElement, 'width', `${size}px`);
                }
            });

        this.building$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(building => {
                if (!building) {
                    this.board.state = SudokuState.running;
                    this._startTime = Date.now();
                    // this._timerId = setInterval(() => {
                    //     const deltaSeconds = Math.floor((Date.now() - this._startTime) / 1000);
                    //     const timeParts = [
                    //         Math.floor(deltaSeconds / 3600),
                    //         Math.floor((deltaSeconds % 3600) / 60),
                    //         Math.floor(deltaSeconds % 60)
                    //     ];
                    //     this.time$.next(timeParts.join(':').replace(/\b(\d)\b/g, '0$1'));
                    // }, 100);
                    this._startTimer();
                } else {
                    this._pauseSum = 0;
                    this.board.state = SudokuState.paused;
                    this.time$.next('00:00:00');
                    this._clearTimer();
                }
            });

        this._buildSudoku();
    }

    public ngAfterViewInit(): void {
        this._resizeBoard();
    }

    public ngOnDestroy(): void {
        this._clearTimer();
        this._destroyed$.next();
    }

    public changeState(): void {
        if (this.board.state === SudokuState.paused) {
            this.board.state = SudokuState.running;
            this._pauseSum += Date.now() - this._pauseTime;
            this._startTimer();
        } else {
            this._pauseTime = Date.now();
            this.board.state = SudokuState.paused;
            this._clearTimer();
        }
    }

    public changeDifficulty(difficulty: SudokuDifficulty): void {
        this.difficulty = difficulty;
        this._buildSudoku();
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

    private _buildSudoku(): void {
        // TODO - Figure out why the Promise is blocking execution... using setTimeout to mimic expected behavior for now
        this.building$.next(true);
        setTimeout(() => {
            this.board.build(this.difficulty).then(() => {
                this.building$.next(false);
            });
        }, 0);
    }

    private _resizeBoard(): void {
        const contentHeight = this.contentEl.nativeElement.clientHeight;
        const contentWidth = this.contentEl.nativeElement.clientWidth;
        const size = contentWidth > contentHeight
            ? contentHeight * 0.9 // Landscape viewport - constrain by height
            : contentWidth * 0.9; // Portrait viewport - constrain by width
        this.boardSize$.next(size);
    }

    private _startTimer(): void {
        this._timerId = setInterval(() => {
            const deltaSeconds = Math.floor((Date.now() - (this._startTime + this._pauseSum)) / 1000);
            const timeParts = [
                Math.floor(deltaSeconds / 3600),
                Math.floor((deltaSeconds % 3600) / 60),
                Math.floor(deltaSeconds % 60)
            ];
            this.time$.next(timeParts.join(':').replace(/\b(\d)\b/g, '0$1'));
        }, 100);
    }

    private _clearTimer(): void {
        if (this._timerId) {
            clearInterval(this._timerId);
        }
    }
}
