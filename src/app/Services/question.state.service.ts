import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./Models";

import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';
import {map} from 'rxjs/operators'

export interface IQuestion{
    question:string,
    by:string,
    topic:string
}


@Injectable()
export class QuestionStateService {
    
    quesListArr:IQuestion[]=[];
    newNotif=0;
    quesList:BehaviorSubject<any>=new BehaviorSubject(this.newNotif);
    $quesList:Observable<any>=this.quesList.asObservable();

    inited=false;

    constructor(){
        
        this.$quesList.subscribe(data=>{
            if(!this.inited){
                this.inited=true;
                return;
            }
            let quesStr:string=JSON.stringify(this.getAllNewQues());
            let newNotifStr:string=JSON.stringify(this.getnewNotif());

            var LS = require( "nativescript-localstorage" );
                LS.setItem('currentQueries',quesStr);
                LS.setItem('newNotif',newNotifStr);

        });
    }

    setFromStorage(){
        var LS = require( "nativescript-localstorage" );
        let questions=LS.getItem('currentQueries');
        let notif=LS.getItem('newNotif');
        if(questions && questions!=''){
            this.quesListArr=JSON.parse(questions);
        }
        else{
            this.quesListArr=[];
        }
        if(notif && notif!=''){
            this.newNotif=JSON.parse(notif);
        }
        else{
            this.newNotif=0;
        }
    }

   addQues(ques:IQuestion){
       //console.log('setting');
    //     let newArrObj;
    //    this.$quesList.subscribe((quesArr:any)=>{
    //        let newArr=quesArr.quesArray.slice();
    //         newArr.splice(0,0,ques);
    //         newArrObj=Object.assign({},quesArr,{quesArray:newArr})
    //     })
        this.quesListArr.splice(0,0,ques);
        this.newNotif++;
       this.quesList.next(this.newNotif);
       //console.log(newArrObj);
   }

   remQues(index:number){
    let newArrObj;
    this.quesListArr.splice(index,1);
    this.quesList.next(newArrObj);
   }

   getAllNewQues():IQuestion[]{
         return this.quesListArr;
   }

   getNewQuesCount(){
       return this.quesListArr.length;
   }

   getnewNotif(){
       return this.newNotif;
   }

   resetNewNotif(){
       this.newNotif=0;
   }

}