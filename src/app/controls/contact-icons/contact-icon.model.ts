export class ContactIconModel {
    href: string;
    class: string;

    constructor(options?: Partial<ContactIconModel>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
