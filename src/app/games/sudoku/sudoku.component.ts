import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SudokuBoard } from './sudoku-board';
import { SudokuCandidate, SudokuCell, SudokuDifficulty, SudokuState } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('sudokuBoardContainer') boardContainerEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChild('sudokuInputContainer') inputContainerEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
    private _activeCellRow?: number = null;
    private _activeCellCol?: number = null;

    private _destroyed$ = new Subject<void>();

    private get _activeCell(): SudokuCell {
        return this._activeCellRow !== null && this._activeCellCol !== null
            ? this.board.cells[this._activeCellRow][this._activeCellCol]
            : null;
    }

    constructor(
        private _renderer: Renderer2
    ) {}

    public ngOnInit(): void {
        this.boardSize$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(size => {
                if (size && this.boardEl && this.inputContainerEl) {
                    // Set board size
                    this._renderer.setStyle(this.boardEl.nativeElement, 'height', `${size}px`);
                    this._renderer.setStyle(this.boardEl.nativeElement, 'width', `${size}px`);

                    // Set input container size based on board size
                    const inputContainerHeight = size / 2;
                    const inputContainerWidth = inputContainerHeight * .75;
                    this._renderer.setStyle(this.inputContainerEl.nativeElement, 'height', `${inputContainerHeight}px`);
                    this._renderer.setStyle(this.inputContainerEl.nativeElement, 'width', `${inputContainerWidth}px`);
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
        window.addEventListener('keydown', this._windowKeydown);
        window.addEventListener('keyup', this._windowKeyup);
    }

    public ngOnDestroy(): void {
        this._clearTimer();
        window.removeEventListener('keydown', this._windowKeydown);
        window.removeEventListener('keyup', this._windowKeyup);
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
        this.board.validate();
    }

    public focusCell(rowIndex: number, colIndex: number): void {
        if (this._activeCell) {
            this._activeCell.active = false;
        }

        this._activeCellRow = rowIndex;
        this._activeCellCol = colIndex;

        (document.querySelector(`#cell-${this._activeCellRow}-${this._activeCellCol}`) as HTMLElement).focus();
        this._activeCell.active = true;
    }

    // TODO: Find solution to needing to turn numlock off for shift + numpad combos OR display some kind of warning to turn numlock off
    // https://stackoverflow.com/questions/55339015/shift-key-released-when-pressing-numpad
    public cellKeydown(rowIndex: number, colIndex: number, event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.code) {
            case 'ArrowUp':
                this._arrowFocusNextCell(rowIndex - 1, colIndex);
                break;
            case 'ArrowDown':
                this._arrowFocusNextCell(rowIndex + 1, colIndex);
                break;
            case 'ArrowLeft':
                this._arrowFocusNextCell(rowIndex, colIndex - 1);
                break;
            case 'ArrowRight':
                this._arrowFocusNextCell(rowIndex, colIndex + 1);
                break;
            case 'Tab':
                this._tabFocusNextCell(rowIndex, this.shifting ? colIndex - 1 : colIndex + 1);
                break;
            case 'Backspace':
            case 'Delete':
                this._activeCell.value = null;
                this._activeCell.candidates = 0;
                this._activeCell.valid = null;
                break;
            case 'Digit1':
            case 'Numpad1':
                if (!this.shifting) {
                    this._activeCell.value = 1;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.one);
                }
                break;
            case 'Digit2':
            case 'Numpad2':
                if (!this.shifting) {
                    this._activeCell.value = 2;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.two);
                }
                break;
            case 'Digit3':
            case 'Numpad3':
                if (!this.shifting) {
                    this._activeCell.value = 3;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.three);
                }
                break;
            case 'Digit4':
            case 'Numpad4':
                if (!this.shifting) {
                    this._activeCell.value = 4;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.four);
                }
                break;
            case 'Digit5':
            case 'Numpad5':
                if (!this.shifting) {
                    this._activeCell.value = 5;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.five);
                }
                break;
            case 'Digit6':
            case 'Numpad6':
                if (!this.shifting) {
                    this._activeCell.value = 6;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.six);
                }
                break;
            case 'Digit7':
            case 'Numpad7':
                if (!this.shifting) {
                    this._activeCell.value = 7;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.seven);
                }
                break;
            case 'Digit8':
            case 'Numpad8':
                if (!this.shifting) {
                    this._activeCell.value = 8;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.eight);
                }
                break;
            case 'Digit9':
            case 'Numpad9':
                if (!this.shifting) {
                    this._activeCell.value = 9;
                    this._activeCell.candidates = 0;
                } else if (!this._activeCell.value) {
                    this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.nine);
                }
                break;
            default:
                return;
        }

        event.preventDefault();
    }

    public inputClick(value: number): void {
        this._activeCell.value = value;
        this._activeCell.candidates = 0;
    }

    private _arrowFocusNextCell(rowIndex: number, colIndex: number): void {
        const nextRowIndex = rowIndex < 0 ? 0 : rowIndex > 8 ? 8 : rowIndex;
        const nextColIndex = colIndex < 0 ? 0 : colIndex > 8 ? 8 : colIndex;
        this.focusCell(nextRowIndex, nextColIndex);
    }

    private _tabFocusNextCell(rowIndex: number, colIndex: number): void {
        let nextRowIndex = rowIndex;
        let nextColIndex = colIndex;
        if (nextColIndex === 9) {
            if (nextRowIndex <= 7) {
                nextRowIndex++;
                nextColIndex = 0;
                this.focusCell(nextRowIndex, nextColIndex);
            } else {
                (document.querySelectorAll(`.sudoku-input`)[0] as HTMLElement).focus();
            }
        } else if (nextColIndex === -1) {
            if (nextRowIndex >= 1) {
                nextRowIndex--;
                nextColIndex = 8;
                this.focusCell(nextRowIndex, nextColIndex);
            } else {
                const actions = document.querySelector(`#sudoku-actions`).children;
                (actions[actions.length - 1] as HTMLElement).focus();
            }
        } else {
            this.focusCell(nextRowIndex, nextColIndex);
        }
    }

    private _buildSudoku(): void {
        this.building$.next(true);
        this.board.build(this.difficulty).then(() => {
            this.building$.next(false);
        });
    }

    private _resizeBoard(): void {
        const contentHeight = this.boardContainerEl.nativeElement.clientHeight;
        const contentWidth = this.boardContainerEl.nativeElement.clientWidth;
        const size = contentWidth > contentHeight
            ? contentHeight * 0.8 // Landscape viewport - constrain by height
            : contentWidth * 0.8; // Portrait viewport - constrain by width
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

    private _windowKeydown = (event: KeyboardEvent): void => {
        if (event.key === 'Shift') {
            this.shifting = true;
        }
    };

    private _windowKeyup = (event: KeyboardEvent): void => {
        if (event.key === 'Shift') {
            this.shifting = false;
        }
    };
}
