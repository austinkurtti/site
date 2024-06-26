import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'hasFlag'
})
export class HasFlagPipe implements PipeTransform {
    public transform(flags: number, flag: number) {
        return flags.hasFlag(flag);
    }
}
