export class ContactIcon {
    href: string;
    class: string;

    constructor(options?: Partial<ContactIcon>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
