import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./Models";

import { Observable,of,BehaviorSubject } from "rxjs";
import 'rxjs/add/observable/of';

export interface IQuestion{
    question:string,
    by:string
}

export interface IQuestionArray{
    quesArray:IQuestion[]
}

const initialState:IQuestionArray={
    quesArray:[]
}


@Injectable()
export class QuestionStateService {
    
    quesList:BehaviorSubject<IQuestionArray>=new BehaviorSubject(initialState);
    $quesList:Observable<IQuestionArray>=this.quesList.asObservable();

    constructor(){
        this.$quesList.subscribe(data=>{});
    }

   addQues(ques:IQuestion){
       console.log('setting');
        let newArrObj;
       this.$quesList.subscribe((quesArr:IQuestionArray)=>{
           let newArr=quesArr.quesArray.slice();
            newArr.splice(0,0,ques);
            newArrObj=Object.assign({},quesArr,{quesArray:newArr})
        })
       this.quesList.next(newArrObj);
       console.log(newArrObj);
   }

   remQues(index:number){
    let newArrObj;
    this.$quesList.subscribe((quesArr:IQuestionArray)=>{
        let newArr=quesArr.quesArray.slice();
         newArr.splice(index,1);
         newArrObj=Object.assign({},quesArr,{quesArray:newArr})
     })
    this.quesList.next(newArrObj);
   }

}