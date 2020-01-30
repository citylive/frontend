import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
import { MessageService } from "../Services/messages.service";


/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "AnswerForm", loadChildren: "./AnswerForm/AnswerForm.module#AnswerFormModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "AnswerForm",
    moduleId: module.id,
    templateUrl: "./AnswerForm.component.html",
    styleUrls: ["./AnswerForm.component.css"]
})
export class AnswerFormComponent implements OnInit {
    currentTopic;
    answer="";
    loggedInUser;

    question="";
    quesBy="";

    constructor(private route:ActivatedRoute,private router:RouterExtensions,private msgSvc:MessageService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       
        
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       var LS = require( "nativescript-localstorage" );
        this.loggedInUser = LS.getItem('LoggedInUser');
       this.route.queryParams.subscribe(params => {
        this.currentTopic= params.topic;
        this.question=params.question;
        this.quesBy=params.by;
        console.log(this.currentTopic);
       });
       
      
    }

    AnswerQuestion(){
        if(this.answer.length>0){
            this.sendAnswer().subscribe((data:any)=>{
                    var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Answer submitted.");
                    toast.show();
                    this.goBack();
            },error=>{
                var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Unable to submit. Please try again!.");
                    toast.show();
            })
        }
        else{
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText("Answer can't be blank.");
            toast.show();
        }
    }

    sendAnswer(){
        return this.msgSvc.addAnswer(this.loggedInUser,this.currentTopic,this.answer);
    }


    toChat(){
        if(this.answer.length==0){
            this.msgSvc.subtoTopic(this.loggedInUser,this.currentTopic).subscribe(dta=>{
                this.routeToChat();
            })
        }
        else{
            this.sendAnswer().subscribe((data:any)=>{
                this.msgSvc.subtoTopic(this.loggedInUser,this.currentTopic).subscribe(dta=>{
                    this.routeToChat();
                })
                
            
        },error=>{
            var Toast = require("nativescript-toast");
                var toast = Toast.makeText("Unable to submit. Please try again!.");
                toast.show();
        }) 
        }
    }

    routeToChat(){
        const navigationExtras: NavigationExtras = {
            queryParams: {
                topic: this.currentTopic,
                question:this.question
            }    
        };
        this.router.navigate(["/chat"], navigationExtras);
    }

    goBack(){
        this.router.navigate(["/welcome"],{ clearHistory : true });
    }

}
