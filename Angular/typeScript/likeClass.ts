export class LikeComponent{
    constructor(private likesCount?:number,public isLiked?:boolean){
        
    }
    like(isLiked:boolean){
        this.likesCount += isLiked?-1:1;
        this.isLiked = !isLiked;   
    }
    showLike(){
        console.log("Total Like:"+this.likesCount);
    }
}