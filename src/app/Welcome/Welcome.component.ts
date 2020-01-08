import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import { QuestionStateService, IQuestion } from "../Services/question.state.service";
import {map} from 'rxjs/operators'
import { Subscription } from "rxjs";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Welcome", loadChildren: "./Welcome/Welcome.module#WelcomeModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Welcome",
    moduleId: module.id,
    templateUrl: "./Welcome.component.html",
    styleUrls: ["./Welcome.component.css"]
})
export class WelcomeComponent implements OnInit{

        LS = require( "nativescript-localstorage" );
        loggedInUser;
        qst$;
        quesState$;
        showLoader=true;
        boldMsg=true;
        
        
    constructor(private router:RouterExtensions,private authReg:AuthorizeRegisterService,private quesState:QuestionStateService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/

    //    this.qst$=quesState.$quesList;

    //    this.quesState$ =this.qst$.pipe(map((ques:IQuestionArray)=>{
    //          return ques.quesArray;
    //      }));
  
    //      this.quesState$.subscribe((data:IQuestion[])=>{
    //          console.log("got data",data);
    //         //  this.pendingQuestions=data;
    //         //  console.log("pendingQues",this.pendingQuestions[0].question,this.pendingQuestions.length);
    //      })
    }


    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       this.showLoader=true;
        var LS = require( "nativescript-localstorage" );
        this.loggedInUser = LS.getItem('LoggedInUser');
        if(this.loggedInUser && this.loggedInUser!='' && this.loggedInUser!=null){
            this.setDeviceId();
            setTimeout(()=>{
                this.showLoader=false;
            },2000);
        }
        else{
            this.LS.setItem('LoggedInUser','');
            this.LS.setItem('currentQueries','');
            this.LS.setItem('msgCountMap','');
            this.LS.setItem('newNotif','');
            this.LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
            this.router.navigate(['/login']);
        }
        
        // this.quesState.setFromStorage();


    }

    setDeviceId(){
        this.authReg.getDeviceId(this.loggedInUser).subscribe(data=>{
            firebase.getCurrentPushToken()
            .then(devId=>{
                if(devId !== data.response){
                  this.authReg.setDeviceId(this.loggedInUser,devId).subscribe(data=>{
                      console.log('Device Registered ',devId,this.loggedInUser);
                      if(data.response !== 'success'){
                        var Toast = require("nativescript-toast");
                        var toast = Toast.makeText("Unable to Register Device.");
                        toast.show();
                      } 
                  })
                }
            }); 

            
        });
    }

    

    askQuestion(){
        this.router.navigate(['/ask']);
    }
}
