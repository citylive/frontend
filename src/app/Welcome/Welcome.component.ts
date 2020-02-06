import { Component, OnInit, OnDestroy, NgZone, ViewChildren, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import { QuestionStateService, IQuestion } from "../Services/question.state.service";
import {map} from 'rxjs/operators'
import { Subscription } from "rxjs";
import { MsgCountStateService } from "../Services/message.count.state.service";
import { MessageService } from "../Services/messages.service";
import { MessagesComponent } from "../Messages/Messages.component";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";
import { ActivatedRoute } from "@angular/router";

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
        msgCt$;
        showLoader=false;
        showFinishing=false;

        msgCountinited=false;
        msgCount=0;
        quesCountinited=false;
        quesCount=0;

        currIndex=0;

        @ViewChild('messagesComp',{static:false})messagesComp:MessagesComponent;
        
        
    constructor(private ngZone:NgZone,private router:RouterExtensions,
        private msgCountState:MsgCountStateService,private msgSvc:MessageService,private route:ActivatedRoute,
        private authReg:AuthorizeRegisterService,private quesState:QuestionStateService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/

       this.qst$=this.quesState.$quesList;

       this.qst$.subscribe(data=>{
          this.ngZone.run(()=>{
            if(this.currIndex !== 0){
                    this.quesCount=quesState.getnewNotif();
            }
          })
        });

        this.msgCt$=this.msgCountState.$quesList;

       this.msgCt$.subscribe(data=>{
          this.ngZone.run(()=>{
            if(this.currIndex !== 1){
                this.msgCount=msgCountState.getnewNotif();
            }
          })
       });

    }


    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       var LS = require( "nativescript-localstorage" );
       this.loggedInUser = LS.getItem('LoggedInUser');
       this.route.queryParams.subscribe(params => {
            if(params.lastRoute && params.lastRoute == 'launcher'){
                this.initilalize(false);
            }
            else if(params.lastRoute && params.lastRoute == 'login'){
                this.initilalize(true);
                this.subscribeToUserTopics();
            }
            else if(params.lastRoute && params.lastRoute == 'msg'){
                this.currIndex=1;
            }
       });
        
        // this.quesState.setFromStorage();


    }

    initilalize(isJustLoggedIn){
        this.showLoader=true;
        if(this.loggedInUser && this.loggedInUser!='' && this.loggedInUser!=null){
            this.setDeviceId();
            setTimeout(()=>{
                if(!isJustLoggedIn){
                    this.showLoader=false;
                    this.checkAndSetLocation();
                }
                
            },2000);
        }
        else{
            this.LS.setItem('LoggedInUser','');
            this.LS.setItem('currentQueries','');
            this.LS.setItem('msgCountMap','');
            this.LS.setItem('newNotif','');
            this.LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
            this.router.navigate(['/login'],{ replaceUrl: true });
        }
    }


    subscribeToUserTopics(){
        this.showFinishing=true;
        this.msgSvc.getTopics(this.loggedInUser).subscribe((data:any)=>{
            let topics=data;
            if(data.length == 0){
                this.showLoader=false;
                this.showFinishing=true;
                this.checkAndSetLocation();
            }
            topics.forEach((topicObj,index)=>{
                firebase.subscribeToTopic(topicObj.topicId.toString())
                .then(topic=>{
                    console.log("Subscribed to",topicObj.topicId.toString());
                    if(index+1 == topics.length){
                        this.showLoader=false;
                        this.showFinishing=true;
                        this.checkAndSetLocation();
                    }
                });
            })
        });
    }

    onPageChange(event){
        this.currIndex=event.newIndex;
        if(this.currIndex === 0){
            this.quesCount=0;
            if(this.messagesComp){
                this.messagesComp.goOutFromMessages();
            }
        }
        else if(this.currIndex === 1){
            this.msgCount=0;
            if(this.messagesComp){
            this.messagesComp.cometoMessages();
            }
        }
        else{
            if(this.messagesComp){
            this.messagesComp.goOutFromMessages();
            }
        }
    }

    setDeviceId(){
        this.authReg.getDeviceId(this.loggedInUser).subscribe((data:any)=>{
            firebase.getCurrentPushToken()
            .then(devId=>{
                if(devId !== data.deviceId){
                  this.authReg.setDeviceId(this.loggedInUser,devId).subscribe(data=>{
                    console.log('Device Registered ',devId,this.loggedInUser);
                      
                  },error=>{
                        var Toast = require("nativescript-toast");
                        var toast = Toast.makeText("Unable to Register Device.");
                        toast.show();
                       
                  })
                }
            }); 

            
        });
    }

    checkAndSetLocation(){
        console.log('Fetching loc');
        if(geolocation){
          geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
          .then(location=>{
                var LS = require( "nativescript-localstorage" );
                let loggedInUser = LS.getItem('LoggedInUser');
                if(loggedInUser && loggedInUser!='' && loggedInUser!=null){
                  this.authReg.updateLocation(location.latitude,location.longitude,loggedInUser).subscribe(data=>{
                    console.log("location updated");
                    // if(data.response === 'success'){
                    //   this.currLocation={
                    //     lat:location.latitude,
                    //     lon:location.longitude
                    //   };
                    // }
                    // console.log('after restCall',data);
                  });
                 
              }
          })
        }
      
      }

    askQuestion(){
        this.router.navigate(['/ask',{clearHistory : true }]);
    }
}
