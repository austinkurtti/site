import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { breakPointDesktop, breakPointTablet } from '@constants/numbers';
import { MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { LocalStorageService } from '@services/local-storage.service';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsDialog } from './settings-dialog/settings-dialog.component';
import { SolvedDialogComponent } from './solved-dialog/solved-dialog.component';
import { SudokuBoard } from './sudoku-board';
import { SudokuCandidate, SudokuCell, SudokuDifficulty, SudokuState } from './sudoku.models';

// TODO
// auto-pause when window loses focus
// settings
// better styling
// confirm resets

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements OnInit, OnDestroy {
    @ViewChild('sudokuBoardContainer') boardContainerEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChild('sudokuInputContainer') inputContainerEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    public board = new SudokuBoard();
    public shifting = false;
    public showClock = true;
    public showConflicts = false;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuDifficulty = SudokuDifficulty;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuState = SudokuState;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuCandidate = SudokuCandidate;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public MenuPosition = MenuPosition;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public TooltipPosition = TooltipPosition;

    public difficulty$ = new BehaviorSubject<SudokuDifficulty>(null);
    public building$ = new BehaviorSubject<boolean>(false);
    public boardSize$ = new BehaviorSubject<number>(0);
    public time$ = new BehaviorSubject<string>('00:00:00');

    private _renderer = inject(Renderer2);
    private _dialogService = inject(DialogService);
    private _router = inject(Router);

    private _timerId;
    private _startTime: number;
    private _pauseTime: number;
    private _pauseSum: number;
    private _activeCellRow?: number = null;
    private _activeCellCol?: number = null;
    private _debounce: Subscription = null;

    private _destroyed$ = new Subject<void>();

    private get _activeCell(): SudokuCell {
        return this._activeCellRow !== null && this._activeCellCol !== null
            ? this.board.cells[this._activeCellRow][this._activeCellCol]
            : null;
    }

    private get _canSetCellValue(): boolean {
        return !this._activeCell.given && this.board.state === SudokuState.running;
    }

    @HostListener('window:resize')
    public windowResize() {
        if (!this._debounce) {
            this._debounce = timer(100).subscribe(() => {
                this._resizeBoard();
                this._clearDebounce();
            });
        }
    }

    public ngOnInit(): void {
        this._updateSettings();

        this.difficulty$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(difficulty => {
                if (difficulty !== null) {
                    this._buildSudoku();
                }
            });

        this.boardSize$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(size => {
                if (size && this.boardEl && this.inputContainerEl) {
                    // Set board size
                    this._renderer.setStyle(this.boardEl.nativeElement, 'height', `${size}px`);
                    this._renderer.setStyle(this.boardEl.nativeElement, 'width', `${size}px`);

                    // Set input size
                    if (document.body.clientWidth < breakPointTablet) { // "Tablet" breakpoint
                        const inputContainerHeight = (size / 4) * 2;
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'height', `${inputContainerHeight}px`);
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'width', `100%`);
                        this._renderer.addClass(this.inputContainerEl.nativeElement.children[0], 'offset-1');
                        this._renderer.addClass(this.inputContainerEl.nativeElement.children[5], 'offset-1');
                    } else if (document.body.clientWidth < breakPointDesktop) { // "Desktop" breakpoint
                        const inputContainerHeight = (size / 8) * 2;
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'height', `${inputContainerHeight}px`);
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'width', `100%`);
                        this._renderer.addClass(this.inputContainerEl.nativeElement.children[0], 'offset-1');
                        this._renderer.addClass(this.inputContainerEl.nativeElement.children[5], 'offset-1');
                    } else {
                        const inputContainerHeight = size / 2;
                        const inputContainerWidth = inputContainerHeight * .75;
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'height', `${inputContainerHeight}px`);
                        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'width', `${inputContainerWidth}px`);
                        this._renderer.removeClass(this.inputContainerEl.nativeElement.children[0], 'offset-1');
                        this._renderer.removeClass(this.inputContainerEl.nativeElement.children[5], 'offset-1');
                    }
                }
            });

        this.building$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(building => {
                if (building) {
                    this.resetTimer();
                } else if (this.difficulty$.value !== null) {
                    this._resizeBoard();
                    this.possibleValues.forEach(v => this._checkCellValueCount(v));
                    window.addEventListener('keydown', this._windowKeydown);
                    window.addEventListener('keyup', this._windowKeyup);
                    this.startTimer();
                }
            });

        this.board.solved$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(solved => {
                if (solved) {
                    // TODO - something fun... confetti?
                    this.pauseTimer(true);
                    this.showSolvedDialog();
                }
            });
    }

    public ngOnDestroy(): void {
        this._dialogService.close();
        this.board.cleanup();
        this._clearTimerInterval();
        this._clearDebounce();
        window.removeEventListener('keydown', this._windowKeydown);
        window.removeEventListener('keyup', this._windowKeyup);
        this._destroyed$.next();
    }

    public showSettingsDialog(): void {
        const componentRef = this._dialogService.show(SettingsDialog, DialogSize.small);
        if (componentRef) {
            componentRef.showClock = this.showClock;
            componentRef.showConflicts = this.showConflicts;
            componentRef.closeCallback = () => {
                this._updateSettings();
            };
        }
    }

    public showSolvedDialog(): void {
        const componentRef = this._dialogService.show(SolvedDialogComponent, DialogSize.small);
        if (componentRef) {
            componentRef.difficulty = this.difficulty$.value;
            componentRef.time = this.time$.value;
            componentRef.goHome = () => {
                this._dialogService.close();
                this._router.navigateByUrl('/games');
            };
            componentRef.playAgain = () => {
                this._dialogService.close();
                this.difficulty$.next(null);
            };
        }
    }

    public resetTimer = (): void => {
        this._pauseSum = 0;
        this.board.state = SudokuState.paused;
        this.time$.next('00:00:00');
        this._clearTimerInterval();
    };

    public startTimer = (): void => {
        this.board.state = SudokuState.running;
        this._startTime = Date.now();
        this._startTimerInterval();
    };

    public pauseTimer = (solved = false): void => {
        this._pauseTime = Date.now();
        this.board.state = solved ? SudokuState.solved : SudokuState.paused;
        this._clearTimerInterval();
    };

    public resumeTimer = (): void => {
        this.board.state = SudokuState.running;
        this._pauseSum += Date.now() - this._pauseTime;
        this._startTimerInterval();
    };

    public changeDifficulty(difficulty: SudokuDifficulty): void {
        this.difficulty$.next(difficulty);
    }

    public checkAll(): void {
        this.board.validateAll(true);
    }

    public checkCell(): void {
        if (this._activeCellRow !== null && this._activeCellCol !== null) {
            this.board.validateCell(this._activeCellRow, this._activeCellCol, true);
        }
    }

    public reset(): void {
        this.board.reset();
        this.resetTimer();
        this.startTimer();
        this.possibleValues.forEach(v => this._checkCellValueCount(v));
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

    // TODO - Find solution to needing to turn numlock off for shift + numpad combos OR display some kind of warning to turn numlock off
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
                if (this._canSetCellValue) {
                    this._setCellValue(null);
                    this._activeCell.candidates = 0;
                }
                break;
            case 'Digit1':
            case 'Numpad1':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(1);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.one);
                    }
                }
                break;
            case 'Digit2':
            case 'Numpad2':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(2);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.two);
                    }
                }
                break;
            case 'Digit3':
            case 'Numpad3':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(3);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.three);
                    }
                }
                break;
            case 'Digit4':
            case 'Numpad4':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(4);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.four);
                    }
                }
                break;
            case 'Digit5':
            case 'Numpad5':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(5);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.five);
                    }
                }
                break;
            case 'Digit6':
            case 'Numpad6':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(6);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.six);
                    }
                }
                break;
            case 'Digit7':
            case 'Numpad7':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(7);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.seven);
                    }
                }
                break;
            case 'Digit8':
            case 'Numpad8':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(8);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.eight);
                    }
                }
                break;
            case 'Digit9':
            case 'Numpad9':
                if (this._canSetCellValue) {
                    if (!this.shifting) {
                        this._setCellValue(9);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.nine);
                    }
                }
                break;
            default:
                return;
        }

        event.preventDefault();
    }

    public inputClick(value: number): void {
        if (this._canSetCellValue) {
            this._setCellValue(value);
        }
    }

    private _setCellValue = (value: number): void => {
        if (value === this._activeCell.value) {
            return;
        }

        const oldValue = this._activeCell.value;
        this._activeCell.value = value;
        this._activeCell.valid = null;

        if (oldValue !== null) {
            this._checkCellValueCount(oldValue);
        }
        if (value === null) {
            if (oldValue !== null) {
                this.board.numEmptyCells++;
            }
        } else {
            this._checkCellValueCount(value);
            if (oldValue === null) {
                this._activeCell.candidates = 0;
                this.board.numEmptyCells--;
            }
        }
    };

    private _checkCellValueCount = (value: number): void => {
        let valueCount = 0;
        this.board.cells.forEach(row => {
            row.forEach(cell => {
                if (cell.value === value) {
                    valueCount++;
                }
            });
        });

        const inputEl = (document.querySelectorAll('.sudoku-input')[value - 1] as HTMLElement);
        if (valueCount >= 9) {
            this._renderer.setAttribute(inputEl, 'disabled', 'true');
        } else {
            this._renderer.removeAttribute(inputEl, 'disabled');
        }
    };

    private _checkConflicts = (): void => {
        if (LocalStorageService.getItem('sudoku_showConflicts')) {
            // TODO
        }
    };

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
        this.board.build(this.difficulty$.value).then(() => {
            this.building$.next(false);
        });
    }

    private _resizeBoard(): void {
        // Minimize the inputs so they don't interfere with board measurements
        this._renderer.setStyle(this.inputContainerEl.nativeElement, 'height', '0px');
        if (this.inputContainerEl.nativeElement.clientWidth !== document.body.clientWidth) {
            this._renderer.setStyle(this.inputContainerEl.nativeElement, 'width', '0px');
        }

        // Measure container and determine how to size the board
        const contentHeight = this.boardContainerEl.nativeElement.clientHeight;
        const contentWidth = this.boardContainerEl.nativeElement.clientWidth;
        const size = contentWidth > contentHeight
            ? contentHeight * 0.8 // Landscape viewport - constrain by height
            : contentWidth * 0.8; // Portrait viewport - constrain by width
        this.boardSize$.next(size);
    }

    private _updateSettings(): void {
        const showClock = LocalStorageService.getItem('sudoku_showClock');
        this.showClock = showClock ?? true;
        const showConflicts = LocalStorageService.getItem('sudoku_showConflicts');
        this.showConflicts = showConflicts ?? false;
    }

    private _startTimerInterval(): void {
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

    private _clearTimerInterval(): void {
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

    private _clearDebounce(): void {
        if (this._debounce) {
            this._debounce.unsubscribe();
            this._debounce = null;
        }
    };
}
