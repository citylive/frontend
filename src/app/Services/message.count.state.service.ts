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
        let newNotif=LS.getItem('msgCountMapNotif');
        console.log('New msg notif count',newNotif)
        if(msgCounts && msgCounts!=''){
            console.log('from store',msgCounts);
            this.msgCountMap=new Map(JSON.parse(msgCounts));
            console.log('from store map',this.msgCountMap);
        }
        else{
            console.log('Not setting from store');
            this.msgCountMap=new Map([]);
        }

        if(newNotif && newNotif!=''){
            this.newNotif=JSON.parse(newNotif);
        }
        else{
            console.log('Not setting from store');
            this.newNotif=0;
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
    console.log("addingCount",topic,this.msgCountMap);
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
    let mnCount=this.msgCountMap.has(topic)?this.msgCountMap.get(topic):0;
    this.newNotif=this.newNotif-mnCount;
    this.msgCountMap.delete(topic);
    this.quesList.next(this.newNotif);
   }

   getAllMsgCount():Map<string,number>{
         return this.msgCountMap;
   }

   resetMsgTopic(topic:string){
    let mnCount=this.msgCountMap.has(topic)?this.msgCountMap.get(topic):0;
    this.newNotif=this.newNotif-mnCount;
    this.msgCountMap.set(topic,0);
    this.quesList.next(this.newNotif);
   }

   getnewNotif(){
       return this.newNotif;
   }

   resetNewNotif(){
       this.newNotif=0;
   }

}