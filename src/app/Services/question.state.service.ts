import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./Models";

import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';
import {map} from 'rxjs/operators'

export interface IQuestion{
    question:string,
    by:string
}

export interface IQuestionArray{
    quesArray:IQuestion[]
}

const initialState:IQuestionArray={
    quesArray:[{
        question: "soumyadip12345",
        by: "this is new ques"
      }, {
        question: "soumyadip12345",
        by: "this is new ques"
      }]
}


@Injectable()
export class QuestionStateService {
    
    quesListArr=[{
        question: "soumyadip12345",
        by: "this is new ques"
      }, {
        question: "soumyadip12345",
        by: "this is new ques"
      }];
    num=0;
    quesList:BehaviorSubject<any>=new BehaviorSubject(this.num);
    $quesList:Observable<any>=this.quesList.asObservable();

    constructor(){
        this.$quesList.subscribe(data=>{});
    }

   addQues(ques){
       //console.log('setting');
    //     let newArrObj;
    //    this.$quesList.subscribe((quesArr:any)=>{
    //        let newArr=quesArr.quesArray.slice();
    //         newArr.splice(0,0,ques);
    //         newArrObj=Object.assign({},quesArr,{quesArray:newArr})
    //     })
        this.quesListArr=[...this.quesListArr,ques];
        console.log('array add',this.quesListArr,ques);
        this.num++;
       this.quesList.next(this.num);
       //console.log(newArrObj);
   }

   remQues(index:number){
    let newArrObj;
    this.$quesList.subscribe((quesArr:any)=>{
        let newArr=quesArr.quesArray.slice();
         newArr.splice(index,1);
         newArrObj=Object.assign({},quesArr,{quesArray:newArr})
     })
    this.quesList.next(newArrObj);
   }

   getAllNewQues():any[]{
         return this.quesListArr;
   }

}