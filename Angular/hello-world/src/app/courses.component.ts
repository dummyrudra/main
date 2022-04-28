import {Component} from '@angular/core';
import { CoursesService } from './courses.services';
@Component({
    selector:'courses',
    template:`   
    TitleCase:<input type="text"[(ngModel)]="titleText">
    <p>{{titleText | title}}</p>
    <h2 [style.color]="isActive?'blue':'red'">{{courses.length +" "+ getTitles()}} </h2>
    <h2 [textContent]="courses.length"></h2> 
    <ul>
        <li *ngFor="let course of courses">{{course}}  <button class="btn btn-sm btn-primary m-2" [class.active]="isActive">Save</button></li>
     
    </ul>
    <img src="{{imageUrl}}"/>
    <img [src]="imageUrl"/>
    <div (click)="onDivClicked()">
    <button class="btn btn-sm btn-danger m-2" (click)="onDelete($event)">Delete</button>
</div>
    <input type="text" [(ngModel)]="email" (keyup.enter)="onKeyUp()">

    <!-- <input type="password"  #pass (keyup.enter)="onPass(pass.value)" />{{pass.value}} -->
    <input type="password"  [value]="pass" (keyup.enter)="pass=$any($event.target).value;onPass()" />
     <!-- <input type="password"  [(ngModel)]="pass" (keyup.enter)="onPass()" /> -->


    <!-- <table>
        <tr>
            <td [attr.colspan]="colSpan"></td>
        </tr>
    </table> -->
    <br/>
  {{course.title | uppercase | lowercase | titlecase}}<br/>
  {{course.rating | number:'2.1-1'}}<br/>
  {{course.student| number}}<br/>
  {{course.price | currency:'INR'}}<br/>
  {{course.releaseDate | date:'shortDate'}}<br/>
  {{summary | summary:20}}<br/>
  {{"New post" | test:22}}
  <br/><br/>

  `

})
export class CoursesComponent{
    titleText=""
    title= "Courses:"
    fontColor='red'
    imageUrl="https://picsum.photos/200/"
    colSpan=2
    isActive=true
    email="abc@gmail.com"
    pass="1234"
    courses
    course={
        title: "The complete Angular course.",
        rating:4.9745,
        student:30123,
        price:190.95,
        releaseDate:new Date(2016,3,1)
    }
    summary=`Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum recusandae eius officia aliquid iste sapiente iure, eaque quis non perspiciatis deserunt assumenda molestias? Vitae sit unde culpa laudantium nisi voluptatem!`

    constructor(service:CoursesService) {
        this.courses = service.getCourses();
    }
    getTitles(){
        return this.title;
    }
    onDivClicked(){
        console.log("Div clicked...");  
    }
    onDelete(event:Event){
        // event.cancelBubble=true // or--->
        event.stopPropagation();
        console.log("Button clicked.....",event);
    }
    onKeyUp(){
        console.log(this.email);
    }
    onPass(){
        console.log(this.pass);
    }
   
}