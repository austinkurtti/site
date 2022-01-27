export class NavigationAnchorModel {
    id: string;
    tooltip: string;

    constructor(options?: Partial<NavigationAnchorModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
