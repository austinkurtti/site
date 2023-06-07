export class GameLinkModel {
    name: string;
    icon: string;
    route: string;

    constructor(name: string, icon: string, route: string) {
        this.name = name;
        this.icon = icon;
        this.route = route;
    }
}
