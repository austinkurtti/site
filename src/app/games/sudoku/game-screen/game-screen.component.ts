import { Component, HostListener, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@components/confirm/confirm.component';
import { MenuPosition } from '@directives/menu/menu.directive';
import { TooltipPosition } from '@directives/tooltip/tooltip.directive';
import { DialogSize } from '@models/dialog.model';
import { Notification } from '@models/notification.model';
import { DialogService } from '@services/dialog.service';
import { NotificationService } from '@services/notification.service';
import { BehaviorSubject, Subject, Subscription, timer } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { FailedDialogComponent } from '../failed-dialog/failed-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { SolvedDialogComponent } from '../solved-dialog/solved-dialog.component';
import { SudokuBoard } from '../sudoku-board';
import { SudokuManager } from '../sudoku-manager';
import { SudokuCandidate, SudokuCell, SudokuGameState, SudokuScreenState } from '../sudoku.models';

@Component({
    selector: 'ak-sudoku-game-screen',
    styleUrls: ['./game-screen.component.scss'],
    templateUrl: './game-screen.component.html'
})
export class SudokuGameScreenComponent implements OnInit, OnDestroy {
    // #region - Public variables
    public gameManager = inject(SudokuManager);

    public possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    public board = new SudokuBoard();
    public shifting = false;
    public pencilIn = false;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public GameState = SudokuGameState;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public SudokuCandidate = SudokuCandidate;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public MenuPosition = MenuPosition;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public TooltipPosition = TooltipPosition;

    public building$ = new BehaviorSubject<boolean>(false);
    // #endregion

    // #region - Private variables
    private _renderer = inject(Renderer2);
    private _dialogService = inject(DialogService);
    private _notificationService = inject(NotificationService);
    private _router = inject(Router);

    private _timerIntervalId;
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
        return !this._activeCell.given && !this._activeCell.revealed && this.board.state === SudokuGameState.running;
    }

    private get _setCandidates(): boolean {
        return this.shifting || this.pencilIn;
    }
    // #endregion

    // #region - HostListeners
    @HostListener('window:keydown.space', ['$event'])
    public windowSpace(event: KeyboardEvent) {
        if (this.board.state === SudokuGameState.paused) {
            this.resumeTimer();
        } else if (this.board.state === SudokuGameState.running) {
            this.pauseTimer();
        }

        event.preventDefault();
    }

    @HostListener('window:keydown.arrowup', ['$event'])
    @HostListener('window:keydown.shift.arrowup', ['$event'])
    public windowArrowUp(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuGameState.running) {
            this._arrowFocusNextCell(this._activeCellRow - 1, this._activeCellCol);
        }
    }

    @HostListener('window:keydown.arrowdown', ['$event'])
    @HostListener('window:keydown.shift.arrowdown', ['$event'])
    public windowArrowDown(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuGameState.running) {
            this._arrowFocusNextCell(this._activeCellRow + 1, this._activeCellCol);
        }
    }

    @HostListener('window:keydown.arrowleft', ['$event'])
    @HostListener('window:keydown.shift.arrowleft', ['$event'])
    public windowArrowLeft(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuGameState.running) {
            this._arrowFocusNextCell(this._activeCellRow, this._activeCellCol - 1);
        }
    }

    @HostListener('window:keydown.arrowright', ['$event'])
    @HostListener('window:keydown.shift.arrowright', ['$event'])
    public windowArrowRight(event: KeyboardEvent) {
        if (this._activeCell && this.board.state === SudokuGameState.running) {
            this._arrowFocusNextCell(this._activeCellRow, this._activeCellCol + 1);
        }
    }
    // #endregion

    // #region - Public methods
    public ngOnInit(): void {
        // ? Is this really the best way to designate a resumed game
        const isResumedGame = this.gameManager.gameInstance.cells.length > 0;

        this.building$
            .pipe(
                skip(1),
                takeUntil(this._destroyed$)
            )
            .subscribe(building => {
                if (building) {
                    if (!isResumedGame) {
                        this.resetTimer();
                    }
                } else {
                    // Initialize active cell values
                    if (isResumedGame) {
                        this.board.cells = this.gameManager.gameInstance.cells;
                        for (let rIndex = 0; rIndex < this.board.cells.length; rIndex++) {
                            const cIndex = this.board.cells[rIndex].findIndex(cell => cell.active);
                            if (cIndex !== -1) {
                                this._activeCellRow = rIndex;
                                this._activeCellCol = cIndex;
                                break;
                            }
                        }
                    } else {
                        this._activeCellRow = this._activeCellCol = 0;
                        this._activeCell.active = true;
                    }

                    // Immediately check for inputs that need to be disabled
                    this._checkAllCellValueCounts();

                    // Attach event listeners
                    window.addEventListener('keydown', this._windowKeydown);
                    window.addEventListener('keyup', this._windowKeyup);
                    document.addEventListener('visibilitychange', this._documentVisibilitychange);

                    // Initialize timer
                    this.startTimer(isResumedGame);
                }
            });

        this.board.solved$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(solved => {
                if (solved) {
                    // TODO - something fun... confetti?
                    this.pauseTimer(SudokuGameState.solved);
                    if (this.gameManager.savedGame) {
                        this.gameManager.deleteSave();
                    }
                    this.showSolvedDialog();
                }
            });

        this.building$.next(true);
        this.board.build(this.gameManager.gameInstance.difficulty, this.gameManager.gameInstance.seed).then(() => {
            this.building$.next(false);
        });
    }

    public ngOnDestroy(): void {
        // Save game if in progress
        if (this.gameManager.gameSettings.exitSave && (this.board.state === SudokuGameState.paused || this.board.state === SudokuGameState.running)) {
            this.gameManager.saveGame(this.board.cells);
        }
        this.gameManager.gameInstance = null;

        // Cleanup
        this._dialogService.close();
        this.board.cleanup();
        this._clearTimerInterval();
        this._clearAutoPauseDebounce();
        window.removeEventListener('keydown', this._windowKeydown);
        window.removeEventListener('keyup', this._windowKeyup);
        document.removeEventListener('visibilitychange', this._documentVisibilitychange);
        this._destroyed$.next();
    }

    public back(): void {
        this.gameManager.screen = SudokuScreenState.menu;
    }

    public showHelpDialog(): void {
        this._dialogService.show(HelpDialogComponent, DialogSize.small);
    }

    public showSettingsDialog(): void {
        const oldDisableInputs = this.gameManager.gameSettings.disableInputs;

        const componentRef = this._dialogService.show(SettingsDialogComponent, DialogSize.small);
        if (componentRef) {
            componentRef.closeCallback = () => {
                if (oldDisableInputs !== this.gameManager.gameSettings.disableInputs) {
                    this._checkAllCellValueCounts();
                }
            };
        }
    }

    public showSolvedDialog(): void {
        const componentRef = this._dialogService.show(SolvedDialogComponent, DialogSize.small);
        if (componentRef) {
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
        this.board.state = SudokuGameState.paused;
        this.gameManager.gameInstance.time$.next('00:00:00');
        this._clearTimerInterval();
    };

    public startTimer = (resumeTimeFromSave = false): void => {
        this.board.state = SudokuGameState.running;
        if (resumeTimeFromSave) {
            const hms = this.gameManager.gameInstance.time$.value.split(':');
            const resumeTime = (((+hms[0]) * 60 * 60) + ((+hms[1]) * 60) + (+hms[2])) * 1000;
            this._pauseSum = 0;
            this._startTime = Date.now() - resumeTime;
        } else {
            this._startTime = Date.now();
        }
        this._startTimerInterval();
    };

    public pauseTimer = (boardStateOverride?: SudokuGameState): void => {
        this._pauseTime = Date.now();
        this.board.state = boardStateOverride ?? SudokuGameState.paused;
        this._clearTimerInterval();
    };

    public resumeTimer = (): void => {
        this.board.state = SudokuGameState.running;
        this._pauseSum += Date.now() - this._pauseTime;
        this._startTimerInterval();
    };

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
            this._checkAllCellValueCounts();
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
                this.pauseTimer(SudokuGameState.solved);
                this._checkAllCellValueCounts();
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
                this._checkAllCellValueCounts();
            };
            componentRef.cancel = () => {
                this._dialogService.close();
            };
        }
    }

    public share(): void {
        // Copy a link to player's clipboard so they can share this puzzle
        if (window.isSecureContext) {
            this._copyLinkToClipboard()
                .then(() => {
                    const notification = new Notification({
                        message: 'Link copied to clipboard'
                    });
                    this._notificationService.success(notification);
                })
                .catch(() => {
                    const notification = new Notification({
                        message: 'Link could not be copied'
                    });
                    this._notificationService.error(notification);
                });
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

    // #region - Private methods
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

            if (this.gameManager.gameSettings.erasePencil && !this.gameManager.gameInstance.hardcore) {
                this.board.clearCandidates(this._activeCellRow, this._activeCellCol, value);
            }
        }

        if (this.gameManager.gameInstance.hardcore && this._activeCell.value) {
            const cellSolution = this.board.getCellSolution(this._activeCellRow, this._activeCellCol);
            if (this._activeCell.value !== cellSolution) {
                this._activeCell.valid = false;
                this.pauseTimer(SudokuGameState.failed);
                if (this.gameManager.savedGame) {
                    this.gameManager.deleteSave();
                }

                const componentRef = this._dialogService.show(FailedDialogComponent, DialogSize.small);
                if (componentRef) {
                    componentRef.correctValue = cellSolution;
                    componentRef.incorrectValue = this._activeCell.value;
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
        }
    };

    private _checkCellValueCount = (value: number): void => {
        if (this.gameManager.gameInstance.hardcore) {
            return;
        }

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
            if (valueCount >= 9 && this.gameManager.gameSettings.disableInputs) {
                this._renderer.setAttribute(inputEl, 'disabled', 'true');
            } else {
                this._renderer.removeAttribute(inputEl, 'disabled');
            }
        }
    };

    private _checkAllCellValueCounts = (): void => {
        this.possibleValues.forEach(v => this._checkCellValueCount(v));
    };

    private _checkConflicts = (valueToCheck: number): void => {
        if (this.gameManager.gameInstance.hardcore) {
            return;
        }

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

    private _copyLinkToClipboard(): Promise<void> {
        const instance = this.gameManager.gameInstance;
        const link = `${document.location.origin}/games/sudoku?d=${instance.difficulty}&h=${instance.hardcore ? 'true' : 'false'}&s=${instance.seed}`;
        return navigator.clipboard.writeText(link);
    }

    private _startTimerInterval(): void {
        // Update timer every 100ms
        this._timerIntervalId = setInterval(() => {
            const deltaSeconds = Math.floor((Date.now() - (this._startTime + this._pauseSum)) / 1000);
            const timeParts = [
                Math.floor(deltaSeconds / 3600),
                Math.floor((deltaSeconds % 3600) / 60),
                Math.floor(deltaSeconds % 60)
            ];
            this.gameManager.gameInstance.time$.next(timeParts.join(':').replace(/\b(\d)\b/g, '0$1'));
        }, 100);
    }

    private _clearTimerInterval(): void {
        if (this._timerIntervalId) {
            clearInterval(this._timerIntervalId);
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
        if (document.visibilityState === 'hidden' && this.board.state !== SudokuGameState.paused) {
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
