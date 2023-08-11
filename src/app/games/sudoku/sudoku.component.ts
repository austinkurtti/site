import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SudokuBoard } from './sudoku-board';
import { SudokuCandidate, SudokuDifficulty, SudokuState } from './sudoku.models';

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
    public shifting = false;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuDifficulty = SudokuDifficulty;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuState = SudokuState;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuCandidate = SudokuCandidate;

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

    public check(): void {
        alert(this.board.valid);
    }

    // TODO: Find solution to needing to turn numlock off for shift + numpad combos OR display some kind of warning to turn numlock off
    // https://stackoverflow.com/questions/55339015/shift-key-released-when-pressing-numpad
    public cellKeydown(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }

        const cell = this.board.cells[rowIndex][colIndex];
        switch (event.code) {
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
                cell.value = null;
                cell.candidates = 0;
                break;
            case 'Digit1':
            case 'Numpad1':
                if (!this.shifting) {
                    cell.value = 1;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.one);
                }
                break;
            case 'Digit2':
            case 'Numpad2':
                if (!this.shifting) {
                    cell.value = 2;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.two);
                }
                break;
            case 'Digit3':
            case 'Numpad3':
                if (!this.shifting) {
                    cell.value = 3;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.three);
                }
                break;
            case 'Digit4':
            case 'Numpad4':
                if (!this.shifting) {
                    cell.value = 4;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.four);
                }
                break;
            case 'Digit5':
            case 'Numpad5':
                if (!this.shifting) {
                    cell.value = 5;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.five);
                }
                break;
            case 'Digit6':
            case 'Numpad6':
                if (!this.shifting) {
                    cell.value = 6;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.six);
                }
                break;
            case 'Digit7':
            case 'Numpad7':
                if (!this.shifting) {
                    cell.value = 7;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.seven);
                }
                break;
            case 'Digit8':
            case 'Numpad8':
                if (!this.shifting) {
                    cell.value = 8;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.eight);
                }
                break;
            case 'Digit9':
            case 'Numpad9':
                if (!this.shifting) {
                    cell.value = 9;
                    cell.candidates = 0;
                } else if (!cell.value) {
                    cell.candidates = cell.candidates.toggleFlag(SudokuCandidate.nine);
                }
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
        this.building$.next(true);
        this.board.build(this.difficulty).then(() => {
            this.building$.next(false);
        });
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
