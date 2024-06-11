export class LocalStorageService {
    public static getItem(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

    public static setItem(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                // TODO
            }
        }
    }

    public static removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
