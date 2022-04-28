"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function logger (){
//     console.log("logged in"); 
// }
// logger();
//________________________________________
// let a:number;
// let b:boolean;
// let c:string;
// let d:any;
// let e:number[];
// let f:any[];
// enum Color {red=0,blue=1,green=2};
// let backgroundColor:Color.red;
//Type Assertion ________________________________________
// let message;
// message = 'abc';
// let endsWithC = (<string>message).toUpperCase();
// console.log(endsWithC);
//Interface ________________________
// let drawPoint = (point:{x:number,y:number})=>{
//   console.log(`X: ${point.x}, Y: ${point.y}`);  
// }
// drawPoint({x:10,y:5});
//         OR
// interface Point{
//     x:number;
//     y:number;
// }        
// let drawPoint = (point=<Point>{}) => {               // or (point:Point)
//     console.log(`X: ${point.x}, Y: ${point.y}`);  
// }
// drawPoint({x:10,y:5});
// Classes and objects_________________________________
// class Point {
//     x:number;
//     y:number;
//     drawPoint () {
//             console.log(`X: ${this.x}, Y: ${this.y}`);  
//         }
// getdistance (another:Point) {
//     console.log("Distance:"+Math.abs(another.y -another.x));
// }
// }
// // let point:Point;  //Invalid
// // let point:Point = new Point();  //Valid
// let point =new Point();
// point.getdistance(<Point>{x:5 ,y:10});
// point.x=20;
// point.y=30;
// point.drawPoint();
// Constructors_________________
// class Point {
//     x:number;y:number;
//     constructor(x?:number,y?:number){
//         this.x= x;
//         this.y= y;
//     }
//     drawPoint(){
//         console.log(`X: ${this.x}, Y: ${this.y}`);  
//      }
// }
// let point = new Point();
// point.x=10;point.y=20;
// point.drawPoint();
// Access modifiers______________________________
// class Point {
//     private x:number;
//     private y:number;
//     constructor(x?:number,y?:number){
//         this.x=x;
//         this.y=y;
//     }
//     drawPoint(){
//         console.log(`X: ${this.x}, Y: ${this.y}`);  
//     }
// }
// let point = new Point(5,7);
// // point.x = 70;
// point.drawPoint();
// Access modifiers with constructor______________________________
// class Point {
//     constructor(private x?: number, public y?: number){
//         this.x = x?x:1;
//         this.y= y;
//     }
//     drawPoint(){
//         console.log(`X: ${this.x}, Y: ${this.y}`);  
//     }
// }
// let point = new Point();
// point.y=30;
// point.drawPoint();
// Properties__________________________________________________________\
var Point = /** @class */ (function () {
    function Point(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            if (value < 0)
                throw new Error("Value cannot be less than zero.");
            this._x = value;
        },
        enumerable: false,
        configurable: true
    });
    return Point;
}());
var point = new Point();
point.x = 2;
console.log(point.x);
