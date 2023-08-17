export class GameLinkModel {
    name: string;
    icon: string;
    route: string;
    disabled: boolean;

    constructor(options?: Partial<GameLinkModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
