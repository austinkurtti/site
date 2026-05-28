export class GameModel {
    name: string;
    icon: string;
    route: string;
    class: any;
    disabled: boolean;

    constructor(options?: Partial<GameModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
