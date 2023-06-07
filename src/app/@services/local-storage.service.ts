export class LocalStorageService {
    public static getItem(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

    public static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
