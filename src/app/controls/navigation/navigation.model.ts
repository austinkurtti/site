export class NavigationAnchorModel {
    id: string;
    text: string;

    constructor(options?: Partial<NavigationAnchorModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
