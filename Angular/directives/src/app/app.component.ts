import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  movies:Array<any>=[];
  allMovies:Array<any>=[];
  genres:Array<any>=[];
  viewMode="list"
  movieName:string="";
  genre:string="";
  btnName:string=""
  selectedMovie:object={}
  searchItem:string=""
  filterTerm:string=""
  errors:Array<any>=[]

  constructor(){
    setTimeout(() =>{
    this.movies = [
      { id:1, name:"new movie" ,genre:"comedy"},
      { id:2, name:"a new movie" ,genre:"action"},
      { id:3, name:"latest movie" ,genre:"thriller"},
      { id:4, name:"new" ,genre:"sci-fi" },
      { id:5, name:"n2" ,genre:"action"}
     ];
     this.allMovies = this.movies;
     this.genres=[
       "comedy", "action", "thriller","sci-fi"
     ]},1000);

  }
  addMovie(name:string,genre:string){
    let  duplicateMovie = this.movies.some(m=>m.name.trim().toLowerCase() === name.trim().toLowerCase());
      if(!duplicateMovie)
        this.movies.push({id:this.movies.length+1,name:name.trim(),genre:genre.trim()})
      else
        alert("Movie name is already taken!")  
  }
  deleteMovie(movie:any){
    if(confirm("Are you sure you want to delete this movie")){
      const index = this.movies.indexOf(movie);
      this.movies.splice(index,1);
    }
  }
  SelectMovieToUpdate(movie:any){  
    this.movieName = movie.name;
    this.genre =movie.genre;
    this.selectedMovie= movie;
    this.btnName = "Update Movie";
  }
  cancelUpdateMovie(){
    this.movieName = "";
    this.genre = "";
    this.selectedMovie={};
    this.btnName = "";
  }
  updateMovie(){
    const index  = this.movies.indexOf(this.selectedMovie);
    this.movies[index].name = this.movieName.trim();
    this.movies[index].genre = this.genre.trim();
    this.cancelUpdateMovie()
  }
  trackCoures(){
    
  }

  searchMovie(searchItem:string){
    setTimeout(() =>{
      this.movies = [...this.allMovies];
      this.movies = this.allMovies.filter(movie=>movie.name.trim().toLowerCase().match(searchItem.trim().toLowerCase()));
    } ,500);
  }

  filterMovie(filter:string){
      this.movies = [...this.allMovies];
      if(filter)
        this.movies = this.movies.filter(movie=>movie.genre===filter);
  }

    validateForm(){
        
      }
     
}
