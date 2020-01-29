import { Injectable } from "@angular/core";
import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';





@Injectable()
export class MsgChatStateService {
    
    newMsg={
        answer:"",
        time:new Date(),
        userName:""
    };
    currTopic='';
    newMessage:BehaviorSubject<any>=new BehaviorSubject(this.newMsg);
    $quesList:Observable<any>=this.newMessage.asObservable();

    constructor(){
        
        this.$quesList.subscribe(data=>{});
    }

    
   addMsg(msg:string,by:string,time:string){
    //    let dt=new Date(time);
    //    console.log('msgTime',dt);
    //    dt.setTime(new Date(time).getTime() - new Date().getTimezoneOffset());
    //    console.log('msgTime',dt);
       console.log("adding",msg);
        this.newMsg={
            answer:msg,
            time:new Date(),
            userName:by
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