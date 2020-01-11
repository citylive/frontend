import { Component, OnInit, NgZone } from "@angular/core";
import { QuestionStateService, IQuestion } from "../Services/question.state.service";
import {setTimeout} from "tns-core-modules/timer";
import {map} from 'rxjs/operators'
import { MessageService } from "../Services/messages.service";
import { NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";

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
    val=0;
    pendingQuestions:IQuestion[]=[];
    userAds=[];

    gotNewQues=false;
    showQues=false;
    newNotif=-1;

    constructor(private ngZone: NgZone ,private quesState:QuestionStateService, private msgSvc:MessageService,private router:RouterExtensions) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
      
      //  this.quesState$ =this.qst$.pipe(map((ques:IQuestionArray)=>{
      //      return ques.quesArray;
      //  }));

      //  this.quesState$.subscribe((data:IQuestion[])=>{
      //      console.log("got data",data);
      //     //  this.pendingQuestions=data;
      //     //  console.log("pendingQues",this.pendingQuestions[0].question,this.pendingQuestions.length);
      //  })
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       console.log('init home');

       this.qst$=this.quesState.$quesList;

       this.qst$.subscribe(data=>{
          this.ngZone.run(()=>{
            this.changeToggle();
          })
          console.log('change happened');
       });

       this.fetchLatestAds();
       

    }

    fetchLatestAds(){
      var LS = require( "nativescript-localstorage" );
        let loggedInUser = LS.getItem('LoggedInUser');
       this.msgSvc.getAdMessages(loggedInUser).subscribe(ads=>{
         this.userAds=ads.response;
       })
    }

    changeToggle(){
      this.newNotif=this.quesState.getnewNotif();
      this.val=this.quesState.getNewQuesCount();
      this.pendingQuestions=this.quesState.getAllNewQues();
    }

    answerQuestion(index){
      const navigationExtras: NavigationExtras = {
        queryParams: {
            topic: this.pendingQuestions[index].topic,
            question:this.pendingQuestions[index].question,
            by:this.pendingQuestions[index].by
        }  ,
    };
    this.remQuery(index);
    this.router.navigate(["/answer"], navigationExtras);
    }
    
    askQuestion(){
      this.router.navigate(["/ask"]);
    }

    changeArr(){
      //   this.pendingQuestions=[...this.pendingQuestions,{
      //       question: "soumyadip12345",
      //   by: "this is new ques"
      // }];
      this.gotNewQues=false;
      console.log("changing Array")
      this.pendingQuestions=this.quesState.getAllNewQues();
      console.log(this.pendingQuestions)

    }

    remQuery(ind){
      this.quesState.remQues(ind);
      this.pendingQuestions=this.quesState.getAllNewQues();
      
    }

    resetNotifCount(){
      this.newNotif=0;
      this.quesState.resetNewNotif();
    }
}
