import {Pipe,PipeTransform} from '@angular/core';

@Pipe({
    name:"summary"
})
export class SummaryPipe implements PipeTransform{
  
    transform(value:string,limit?:number){
        let actualLimit = limit?limit:10;
        return value.substring(0,actualLimit);
    }
}