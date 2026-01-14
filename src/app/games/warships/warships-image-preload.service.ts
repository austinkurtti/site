import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WarshipsImagePreloadService {
    private _preloadedImages = new Set<string>();

    public preloadImages(images: string[]): Promise<void>[] {
        const loadPromises: Promise<void>[] = [];

        images.forEach(img => {
            if (!this._preloadedImages.has(img)) {
                // Preload via <link> for browser hinting
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = `assets/images/warships/${img}`;
                const promise = new Promise<void>((resolve) => {
                    // ? Consider some kind of error message for onerror with reject()
                    link.onload = link.onerror = () => resolve();
                });
                document.head.appendChild(link);

                loadPromises.push(promise);
                this._preloadedImages.add(img);
            }
        });

        return loadPromises;
    }
}
