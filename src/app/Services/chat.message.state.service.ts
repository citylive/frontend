import { Injectable } from "@angular/core";
import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';





@Injectable()
export class MsgChatStateService {
    
    newMsg={
        message:"",
        time:"",
        by:""
    };
    currTopic='';
    newMessage:BehaviorSubject<any>=new BehaviorSubject(this.newMsg);
    $quesList:Observable<any>=this.newMessage.asObservable();

    constructor(){
        
        this.$quesList.subscribe(data=>{});
    }

    
   addMsg(msg:string,by:string,time:string){
       console.log("adding",msg);
        this.newMsg={
            message:msg,
            time:time,
            by:by
        };
        this.newMessage.next(msg);
       //console.log(newArrObj);
   }

   setTopic(topic:string){
    this.currTopic=topic;
   }

   
   resetTopic(){
    this.currTopic='';
   }

}