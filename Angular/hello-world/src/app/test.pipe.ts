import {Pipe,PipeTransform} from '@angular/core';

@Pipe({
    name:"test"
})

export class TestPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return value.toUpperCase().substr(0,args[0]|| 5);
    }   
}