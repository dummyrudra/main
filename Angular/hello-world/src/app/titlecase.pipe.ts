import {Component, Pipe ,PipeTransform} from "@angular/core";

@Pipe({
    name:"title"
})

export class TitlePipe implements PipeTransform {
    transform(value: string){
       let valueArr = value.toLowerCase().split(" ");
       for (let i=0;i<valueArr.length;i++){
           if(i===0 || valueArr[i]!=="of" && valueArr[i]!=="the")
           valueArr[i]= valueArr[i].charAt(0).toUpperCase()+valueArr[i].slice(1);  
           else 
            valueArr[i]= valueArr[i].toLowerCase();
       }
       return valueArr.join(" ");
    }
}