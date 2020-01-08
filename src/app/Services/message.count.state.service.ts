import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./Models";

import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';
import {map} from 'rxjs/operators'




@Injectable()
export class MsgCountStateService {
    
    msgCountMap:Map<string,number>=new Map([]);
    newNotif=0;
    quesList:BehaviorSubject<any>=new BehaviorSubject(this.newNotif);
    $quesList:Observable<any>=this.quesList.asObservable();

    constructor(){
        
        this.$quesList.subscribe(data=>{});
    }

    setFromStorage(){
        var LS = require( "nativescript-localstorage" );
        let msgCounts=LS.getItem('msgCountMap');
        if(msgCounts && msgCounts!=''){
            this.msgCountMap=JSON.parse(msgCounts);
        }
        else{
            this.msgCountMap=new Map([]);
        }
        
    }

   addMsgCount(topic:string){
       //console.log('setting');
    //     let newArrObj;
    //    this.$quesList.subscribe((quesArr:any)=>{
    //        let newArr=quesArr.quesArray.slice();
    //         newArr.splice(0,0,ques);
    //         newArrObj=Object.assign({},quesArr,{quesArray:newArr})
    //     })
        if(this.msgCountMap.has(topic)){
            let currCount=this.msgCountMap.get(topic);
            this.msgCountMap.set(topic,currCount+1);
        }
        else{
            this.msgCountMap.set(topic,1);
        }
        this.newNotif++;
        this.quesList.next(this.newNotif);
       //console.log(newArrObj);
   }

   remMsgTopic(topic:string){
    this.msgCountMap.delete(topic);
   }

   getAllMsgCount(){
         return this.msgCountMap;
   }

   resetMsgTopic(topic:string){
    this.msgCountMap.set(topic,0);
   }

   getnewNotif(){
       return this.newNotif;
   }

   resetNewNotif(){
       this.newNotif=0;
   }

}