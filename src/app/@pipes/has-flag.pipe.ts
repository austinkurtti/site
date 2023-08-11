import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hasFlag'
})
export class HasFlagPipe implements PipeTransform {
    public transform(flags: number, flag: number) {
        return flags.hasFlag(flag);
    }
}
