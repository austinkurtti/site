export class Notification {
    public duration = 7.5;
    public message: string;

    constructor(partial?: Partial<Notification>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
