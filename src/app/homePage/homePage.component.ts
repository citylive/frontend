import { Component, OnInit } from "@angular/core";
import { QuestionStateService, IQuestionArray, IQuestion } from "../Services/question.state.service";
import {map} from 'rxjs/operators'

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "homePage", loadChildren: "./homePage/homePage.module#HomePageModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "HomePage",
    moduleId: module.id,
    templateUrl: "./homePage.component.html",
    styleUrls: ["./homePage.component.css"]
})
export class HomePageComponent implements OnInit {

    qst$;
    quesState$;
    val="value"
    pendingQuestions:IQuestion[]=[{
        question: "soumyadip12345",
        by: "this is new ques"
      }, {
        question: "soumyadip12345",
        by: "this is new ques"
      }];

    constructor(private quesState:QuestionStateService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       this.qst$=quesState.$quesList;

       this.quesState$ =this.qst$.pipe(map((ques:IQuestionArray)=>{
           return ques.quesArray;
       }));

       this.quesState$.subscribe((data:IQuestion[])=>{
           console.log("got data",data);
           this.pendingQuestions=data;
           console.log("pendingQues",this.pendingQuestions[0].question,this.pendingQuestions.length);
       })
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }

    changeArr(){
        this.pendingQuestions=[{
            question: "soumyadip12345",
        by: "this is new ques"
      }, {
        question: "soumyadip12345",
        by: "this is new ques"
      },
      {question: "soumyadip12345",
      by: "this is new ques"
    }, {
      question: "soumyadip12345",
      by: "this is new ques"
    }];
    }
}
