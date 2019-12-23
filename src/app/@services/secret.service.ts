import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SecretService {
    public secretActivated$ = new BehaviorSubject<boolean>(false);
}
