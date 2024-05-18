import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { DialogSize } from '@models/dialog.model';
import { DialogService } from '@services/dialog.service';
import { LocalStorageService } from '@services/local-storage.service';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SolvedDialogComponent } from './solved-dialog/solved-dialog.component';
import { SudokuBoard } from './sudoku-board';
import { SudokuCandidate, SudokuCell, SudokuDifficulty, SudokuState } from './sudoku.models';

@Component({
    selector: 'ak-sudoku',
    styleUrls: ['./sudoku.component.scss'],
    templateUrl: './sudoku.component.html'
})
export class SudokuComponent implements OnInit, OnDestroy {
    // #region Public variables
    @ViewChild('sudokuBoardContainer') boardContainerEl: ElementRef;
    @ViewChild('sudokuBoard') boardEl: ElementRef;
    @ViewChild('sudokuInputContainer') inputContainerEl: ElementRef;
    @ViewChildren('sudokuCell') cellEls: QueryList<ElementRef>;

    public possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    public board = new SudokuBoard();
    public shifting = false;
    public pencilIn = false;

    // Settings
    public showClock = true;
    public showConflicts = false;
    public autoPencilErase = false;
    public autoDisableInputs = true;

    // Re-defs
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
    public time$ = new BehaviorSubject<string>('00:00:00');
    // #endregion

    // #region Private variables
    // Injectables
    private _renderer = inject(Renderer2);
    private _dialogService = inject(DialogService);
    private _router = inject(Router);

    private _timerId;
    private _startTime: number;
    private _pauseTime: number;
    private _pauseSum: number;
    private _autoPauseDebounce: Subscription;
    private _activeCellRow?: number = null;
    private _activeCellCol?: number = null;

    private _destroyed$ = new Subject<void>();

    private get _activeCell(): SudokuCell {
        return this._activeCellRow !== null && this._activeCellCol !== null
            ? this.board.cells[this._activeCellRow][this._activeCellCol]
            : null;
    }

    private get _canSetCellValue(): boolean {
        return !this._activeCell.given && !this._activeCell.revealed && this.board.state === SudokuState.running;
    }

    private get _setCandidates(): boolean {
        return this.shifting || this.pencilIn;
    }
    // #endregion

    @HostListener('window:keydown.space', ['$event'])
    public windowSpace(event: KeyboardEvent) {
        if (this.board.state === SudokuState.paused) {
            this.resumeTimer();
        } else if (this.board.state === SudokuState.running) {
            this.pauseTimer();
        }

        event.preventDefault();
    }

    @HostListener('window:keydown.arrowup', ['$event'])
    public windowArrowUp(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuState.running) {
            this._arrowFocusNextCell(this._activeCellRow - 1, this._activeCellCol);
        }
    }

    @HostListener('window:keydown.arrowdown', ['$event'])
    public windowArrowDown(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuState.running) {
            this._arrowFocusNextCell(this._activeCellRow + 1, this._activeCellCol);
        }
    }

    @HostListener('window:keydown.arrowleft', ['$event'])
    public windowArrowLeft(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuState.running) {
            this._arrowFocusNextCell(this._activeCellRow, this._activeCellCol - 1);
        }
    }

    @HostListener('window:keydown.arrowright', ['$event'])
    public windowArrowRight(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuState.running) {
            this._arrowFocusNextCell(this._activeCellRow, this._activeCellCol + 1);
        }
    }

    // #region Angular lifecycle
    public ngOnInit(): void {
        this._updateSettings();

        this.difficulty$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(difficulty => {
                if (difficulty !== null) {
                    this._buildSudoku();
                }
            });

        this.building$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(building => {
                if (building) {
                    this.resetTimer();
                } else if (this.difficulty$.value !== null) {
                    this._activeCellRow = this._activeCellCol = 0;
                    this._activeCell.active = true;
                    this.possibleValues.forEach(v => this._checkCellValueCount(v));
                    window.addEventListener('keydown', this._windowKeydown);
                    window.addEventListener('keyup', this._windowKeyup);
                    document.addEventListener('visibilitychange', this._documentVisibilitychange);
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
        this._clearAutoPauseDebounce();
        window.removeEventListener('keydown', this._windowKeydown);
        window.removeEventListener('keyup', this._windowKeyup);
        document.removeEventListener('visibilitychange', this._documentVisibilitychange);
        this._destroyed$.next();
    }
    // #endregion

    // #region Public methods
    public back(): void {
        this.difficulty$.next(null);
    }

    public showHelpDialog(): void {
        this._dialogService.show(HelpDialogComponent, DialogSize.small);
    }

    public showSettingsDialog(): void {
        const componentRef = this._dialogService.show(SettingsDialogComponent, DialogSize.small);
        if (componentRef) {
            componentRef.showClock = this.showClock;
            componentRef.showConflicts = this.showConflicts;
            componentRef.autoPencilErase = this.autoPencilErase;
            componentRef.autoDisableInputs = this.autoDisableInputs;
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
                this.back();
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

    public checkCell(): void {
        if (this._activeCellRow !== null && this._activeCellCol !== null && this._canSetCellValue) {
            this.board.validateCell(this._activeCellRow, this._activeCellCol, true);
        }
    }

    public checkAll(): void {
        this.board.validateAll(true);
    }

    public revealCell(): void {
        if (this._activeCellRow !== null && this._activeCellCol !== null && this._canSetCellValue) {
            this.board.revealCell(this._activeCellRow, this._activeCellCol);
            this.possibleValues.forEach(v => this._checkCellValueCount(v));
            this.board.checkSolved();
        }
    }

    public revealAll(): void {
        const componentRef = this._dialogService.show(ConfirmDialogComponent, DialogSize.minimal, false);
        if (componentRef) {
            componentRef.title = 'Confirm Reveal';
            componentRef.message = 'This action will end the game. Are you sure you want to reveal everything?';
            componentRef.confirmText = 'Reveal';
            componentRef.cancelText = 'Cancel';
            componentRef.confirm = () => {
                this._dialogService.close();
                this.board.revealAll();
                this.pauseTimer(true);
                this.possibleValues.forEach(v => this._checkCellValueCount(v));
            };
            componentRef.cancel = () => {
                this._dialogService.close();
            };
        }
    }

    public reset(): void {
        const componentRef = this._dialogService.show(ConfirmDialogComponent, DialogSize.minimal, false);
        if (componentRef) {
            componentRef.title = 'Confirm Reset';
            componentRef.message = 'All progress will be lost. Are you sure you want to reset?';
            componentRef.confirmText = 'Reset';
            componentRef.cancelText = 'Cancel';
            componentRef.confirm = () => {
                this._dialogService.close();
                this.board.reset();
                this.resetTimer();
                this.startTimer();
                this.possibleValues.forEach(v => this._checkCellValueCount(v));
            };
            componentRef.cancel = () => {
                this._dialogService.close();
            };
        }
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
            case 'Tab':
                this._tabFocusNextCell(rowIndex, this.shifting ? colIndex - 1 : colIndex + 1);
                break;
            default:
                this._setCellValueOrCandidate(event.code);
                break;
        }

        event.preventDefault();
    }

    public inputClick(value: number): void {
        if (this._canSetCellValue) {
            this._setCellValueOrCandidate(this._getValueCode(value));
        }
    }
    // #endregion

    // #region Private methods
    private _getValueCode = (value: number): string => value >= 1 && value <= 9 ? `Digit${value}` : 'Delete';

    private _setCellValueOrCandidate = (valueCode: string): void => {
        switch (valueCode) {
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
                    if (!this._setCandidates) {
                        this._setCellValue(1);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.one);
                    }
                }
                break;
            case 'Digit2':
            case 'Numpad2':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(2);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.two);
                    }
                }
                break;
            case 'Digit3':
            case 'Numpad3':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(3);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.three);
                    }
                }
                break;
            case 'Digit4':
            case 'Numpad4':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(4);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.four);
                    }
                }
                break;
            case 'Digit5':
            case 'Numpad5':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(5);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.five);
                    }
                }
                break;
            case 'Digit6':
            case 'Numpad6':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(6);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.six);
                    }
                }
                break;
            case 'Digit7':
            case 'Numpad7':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(7);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.seven);
                    }
                }
                break;
            case 'Digit8':
            case 'Numpad8':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(8);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.eight);
                    }
                }
                break;
            case 'Digit9':
            case 'Numpad9':
                if (this._canSetCellValue) {
                    if (!this._setCandidates) {
                        this._setCellValue(9);
                    } else if (!this._activeCell.value) {
                        this._activeCell.candidates = this._activeCell.candidates.toggleFlag(SudokuCandidate.nine);
                    }
                }
                break;
            default:
                return;
        }
    };

    private _setCellValue = (value: number): void => {
        if (value === this._activeCell.value) {
            return;
        }

        const oldValue = this._activeCell.value;
        this._activeCell.value = value;
        this._activeCell.valid = null;

        if (oldValue !== null) {
            this._checkCellValueCount(oldValue);
            this._checkConflicts(oldValue);
        }
        if (value === null) {
            this._activeCell.numConflicts = 0;
            if (oldValue !== null) {
                this.board.numEmptyCells++;
            }
        } else {
            this._checkCellValueCount(value);
            this._checkConflicts(value);
            if (oldValue === null) {
                this._activeCell.candidates = 0;
                this.board.numEmptyCells--;
            } else {
                this.board.checkSolved();
            }

            if (this.autoPencilErase) {
                this.board.clearCandidates(this._activeCellRow, this._activeCellCol, value);
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
        if (inputEl) {
            if (valueCount >= 9 && this.autoDisableInputs) {
                this._renderer.setAttribute(inputEl, 'disabled', 'true');
            } else {
                this._renderer.removeAttribute(inputEl, 'disabled');
            }
        }
    };

    private _checkConflicts = (valueToCheck: number): void => {
        const squareRowStart = Math.floor(this._activeCellRow / 3) * 3;
        const squareRowEnd = squareRowStart + 3;
        const squareColStart = Math.floor(this._activeCellCol / 3) * 3;
        const squareColEnd = squareColStart + 3;
        const square = this.board.cells.slice(squareRowStart, squareRowEnd).map(squareRow => squareRow.slice(squareColStart, squareColEnd));
        const squareCells = [...square[0], ...square[1], ...square[2]];

        if (valueToCheck === this._activeCell.value) {
            this._activeCell.numConflicts = 0;

            // Check for any conflicts in the row, column or square
            const rowConflict = this.board.cells[this._activeCellRow].filter(cell => cell.value === valueToCheck).length > 1;
            const colConflict = this.board.cells.filter(row => row[this._activeCellCol].value === valueToCheck).length > 1;
            const squareConflict = squareCells.filter(cell => cell.value === valueToCheck).length > 1;

            if (rowConflict) {
                this.board.cells[this._activeCellRow].forEach(cell => {
                    if (cell.value === valueToCheck) {
                        cell.numConflicts++;
                    }
                });
            }
            if (colConflict) {
                this.board.cells.forEach(row => {
                    if (row[this._activeCellCol].value === valueToCheck) {
                        row[this._activeCellCol].numConflicts++;
                    }
                });
            }
            if (squareConflict) {
                squareCells.forEach(cell => {
                    if (cell.value === valueToCheck) {
                        cell.numConflicts++;
                    }
                });
            }
        } else {
            // Remove conflicts for the row, column and square
            this.board.cells[this._activeCellRow].forEach(cell => {
                if (cell.value === valueToCheck) {
                    cell.numConflicts--;
                }
            });
            this.board.cells.forEach(row => {
                if (row[this._activeCellCol].value === valueToCheck) {
                    row[this._activeCellCol].numConflicts--;
                }
            });
            squareCells.forEach(cell => {
                if (cell.value === valueToCheck) {
                    cell.numConflicts--;
                }
            });
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

    private _updateSettings(): void {
        const showClock = LocalStorageService.getItem('sudoku_showClock');
        this.showClock = showClock ?? true;

        const showConflicts = LocalStorageService.getItem('sudoku_showConflicts');
        this.showConflicts = showConflicts ?? false;

        const autoPencilErase = LocalStorageService.getItem('sudoku_autoPencilErase');
        this.autoPencilErase = autoPencilErase ?? false;

        const autoDisableInputs = LocalStorageService.getItem('sudoku_autoDisableInputs');
        const autoDisableInputsOld = this.autoDisableInputs;
        this.autoDisableInputs = autoDisableInputs ?? true;
        if (autoDisableInputs !== autoDisableInputsOld) {
            this.possibleValues.forEach(v => this._checkCellValueCount(v));
        }
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

    private _clearAutoPauseDebounce(): void {
        this._autoPauseDebounce?.unsubscribe();
        this._autoPauseDebounce = null;
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

    private _documentVisibilitychange = (event: Event): void => {
        if (document.visibilityState === 'hidden' && this.board.state !== SudokuState.paused) {
            if (this._autoPauseDebounce) {
                return;
            }

            this._autoPauseDebounce = timer(60000).subscribe(() => {
                this.pauseTimer();
                this._clearAutoPauseDebounce();
            });
        } else if (document.visibilityState === 'visible' && this._autoPauseDebounce) {
            this._clearAutoPauseDebounce();
        }
    };
    // #endregion
}
