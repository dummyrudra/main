export class Point {
    constructor(private x?: number, public y?: number){
        this.x = x?x:1;
        this.y= y;
    }
    drawPoint(){
        console.log(`X: ${this.x}, Y: ${this.y}`);  
    }
}


