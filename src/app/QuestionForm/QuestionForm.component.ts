import { Component, OnInit } from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { RouterExtensions } from "nativescript-angular";
import { MessageService } from "../Services/messages.service";
import { NavigationExtras } from "@angular/router";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "QuestionForm", loadChildren: "./QuestionForm/QuestionForm.module#QuestionFormModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "QuestionForm",
    moduleId: module.id,
    templateUrl: "./QuestionForm.component.html",
    styleUrls: ["./QuestionForm.component.css"]
})
export class QuestionFormComponent implements OnInit {

    question="";
    latitude;
    longitude;
    suggestionQuestions=[];

    constructor(private router:RouterExtensions,private msgSvc:MessageService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }



    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       geolocation.enableLocationRequest()
       .then(()=>{
            geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
            .then((location)=>{
                this.latitude=location.latitude;
                this.longitude=location.longitude
            })
       });
       this.suggestionQuestions=suggestions;
    }

    goBack(){
        this.router.navigate(["/welcome"],{ clearHistory : true });
      }

    askQuestion(){
        var LS = require( "nativescript-localstorage" );
        let loggedInUser = LS.getItem('LoggedInUser');
        if(loggedInUser && loggedInUser!='' && loggedInUser!=null){
            this.msgSvc.askQuestion({
                askedby:loggedInUser,
                question:this.question,
                closed:false,
                latitude:this.latitude,
                longitude:this.longitude
            }).subscribe(data=>{
                if(data.topicId){
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            topic: data.topicId,
                            question:this.question
                        }   
                    };
                    this.router.navigate(["/chat"], navigationExtras);
                }
                else{
                    var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Unable to submit question. Please try again!");
                    toast.show();
                }
            })
        }
        else{
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText("Unable to submit question. Please Login first!");
            toast.show();
            LS.setItem('LoggedInUser','');
            LS.setItem('currentQueries','');
            LS.setItem('msgCountMap','');
            LS.setItem('msgCountMapNotif','');
            LS.setItem('newNotif','');
            LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
            this.router.navigate(['/login'],{ replaceUrl: true });
        }
    }  
}


export const suggestions=[
    "How much are you enjoying the CityLive app?",
    "What are the Best Restaurants around here?",
    "What are the Best Sports Grounds around here?",
    "What are the Places of Attraction around?",
    "Anyone up for a game of football today at 5:30 PM?",
    "How was the Movie?",
    "Can someone send Links to some good songs?"
]