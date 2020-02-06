import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { RouterExtensions } from "nativescript-angular";
import { MessageService } from "../Services/messages.service";
import { MsgChatStateService } from "../Services/chat.message.state.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {screen} from "tns-core-modules/platform/platform"
import { setInterval } from "tns-core-modules/timer/timer";

import { Volume } from 'nativescript-volume';

import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";
import { MsgCountStateService } from "../Services/message.count.state.service";


/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "ChatWindow", loadChildren: "./ChatWindow/ChatWindow.module#ChatWindowModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/



@Component({
    selector: "ChatWindow",
    moduleId: module.id,
    templateUrl: "./ChatWindow.component.html",
    styleUrls: ["./ChatWindow.component.css"],
    providers:[Volume]
})
export class ChatWindowComponent implements OnInit,OnDestroy,AfterViewInit {

    currentTopic;
    messages=[];
    loggedInUser="";
    question="";
    message="";
    unreadCount=0;

    timerset;
    initTextTop=0;
    messagesHgt=0;
    disclaimerHgt=0;

    lastScrollY=0;
    lastScrollX=0;

    scrollListener;
    remToBottomListener;

    isBottomScroll=false;

    keyBoardHeight=300;

    scrolledToBottom=true;

    loadingMsges=true;

    sound = require("nativescript-sound");
    tada;
    

   

    @ViewChild("scrollView", { static: false }) scrollView: ElementRef;
    @ViewChild("textInp", { static: false }) textInp: ElementRef;

    constructor(private ngZone:NgZone,private route:ActivatedRoute,
        private router:RouterExtensions,private msgCountState:MsgCountStateService,private msgsvc:MessageService,
        private msgState:MsgChatStateService,private volume:Volume) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       console.log("constructor")
       
       
    }
    
    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    //    let that = this;
       
    //    application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
    //         that.offKeyBoard();    
    //         data.cancel = true; // prevents default back button behavior   
    //   });
        console.log('Initing');
        this.tada = this.sound.create("~/app/sounds/when.mp3");
        var LS = require( "nativescript-localstorage" );
        this.loggedInUser = LS.getItem('LoggedInUser');

        this.route.queryParams.subscribe(params => {
           // this.question=params.question?params.question:this.question;
            if(this.currentTopic != params.topic){
                this.currentTopic= params.topic;
                this.fetchMsgs();
            }
            
            // if(params.time && params.time != ""){

            //     let TmArr=params.time.split(' ');
            //     let newVal=TmArr.join('T');
            //     console.log(newVal);

            //     let currDate=new Date(newVal+'Z');
            //     let lastDate=new Date(this.messages[this.messages.length-1].time);

            //     if(currDate > lastDate){
            //         this.fetchMsgs();
            //     }
                
            // }
            console.log(this.currentTopic);
            firebase.subscribeToTopic(this.currentTopic)
            .then(()=>{
                console.log("subscribed");
            })
            .catch(error=>{
                console.log(error);
            })
        });
        this.msgState.setTopic(this.currentTopic);
        
        this.msgState.$quesList.subscribe(msg=>{
            this.ngZone.run(()=>{
                this.addNextMsg();
              })
           });


        this.fetchMsgs();
      
    }

    fetchMsgs(){
        this.msgCountState.resetMsgTopic(this.currentTopic);
        this.loadingMsges=true;
        this.msgsvc.getTopic(this.currentTopic).subscribe((data:any)=>{
            console.log(data);
            this.question=data.question;
        })
        this.msgsvc.getAllMessages(this.currentTopic).subscribe((data:any)=>{
            this.messages=data;
            setTimeout(()=>{
                this.scrollToBottom();
                this.loadingMsges=false;
            },1500);
        })
    }

    ngAfterViewInit(){
        // this.initTextTop=this.textInp.nativeElement.getLocationOnScreen().y;
        this.keyboardSizer();
    }


    keyboardSizer(){
        console.log("Sizing Keyboardd",screen.mainScreen.widthDIPs);
        this.keyBoardHeight=Math.min(Math.round(screen.mainScreen.widthDIPs*0.85),450);
    }

    offKeyBoard(){
        this.messagesHgt=0;
        this.disclaimerHgt=0;
    }

    scrollToBottom(){
        setTimeout(()=>{
            this.unreadCount=0;
            this.scrollView.nativeElement.scrollToVerticalOffset(this.scrollView.nativeElement.scrollableHeight, false);
            
            // this.scrolledToBottom=true;
            // this.isBottomScroll=true;
            // clearInterval(this.remToBottomListener);
            // this.remToBottomListener=setTimeout(()=>{
            //     this.isBottomScroll=false;
            // },100)
        },150);
        
    }


    textfieldTapped(){
        this.disclaimerHgt=this.keyBoardHeight;
        let txtBoxTop=this.textInp.nativeElement.getLocationOnScreen().y;
        let scrollBoxTop=this.scrollView.nativeElement.getLocationOnScreen().y;
        if(txtBoxTop==this.initTextTop){
            this.messagesHgt=txtBoxTop-scrollBoxTop-this.keyBoardHeight;
        }
        this.scrollToBottom();

    }

    onScroll(event){
        clearInterval(this.scrollListener);
        this.scrollListener=setInterval(()=>{
            console.log(event.scrollY,this.scrollView.nativeElement.scrollableHeight);
            this.scrolledToBottom=Math.abs(event.scrollY - this.scrollView.nativeElement.scrollableHeight)<3;
            clearInterval(this.scrollListener);
        },20);
        
    }


    addNextMsg(){
        let newMsg=this.msgState.newMsg;
        if(newMsg.reload){
            if(this.messages.length >0 && newMsg.time > new Date(this.messages[this.messages.length-1].time)){
                    this.fetchMsgs();
            }      
            return;   
        }
        console.log("new msg rec",newMsg);
        if(newMsg.answer.length>0 && newMsg.userName != this.loggedInUser ){
             // preload the audio file
             let vol=this.volume.getVolume();
             this.volume.setVolume(Math.min(10,vol));
            // play the sound (i.e. tap event handler)
            this.tada.play();
            setTimeout(()=>{
                this.volume.setVolume(vol);
            },1000);
            this.messages.push(newMsg);
            // this.scrollToBottom();
            if(this.scrolledToBottom){
                // this.scrolledToBottom=false;
                this.scrollToBottom();
            }
            this.unreadCount++;
        }
    }

    onCrossPress(){
        dialogs.confirm({
            title: "Quit the Discussion?",
            message: "Press Quit to unsubscribe from discussion.",
            okButtonText: "Quit",
            cancelButtonText: "Go Back",
            neutralButtonText: "Stay"
        }).then(result => {
            // result argument is boolean
            if(result != undefined){
                if(result){
                    this.unsubTopic();
                }
                this.goBack();
            }
            
        });
    }

    sendMsg(){
        console.log(this.message,this.message.length);
        if(this.message.length == 0){
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText("Can't send empty message");
            toast.show();
            return;
        }
        let msg=this.message;
        this.message="";
        this.msgsvc.addAnswer(this.loggedInUser,this.currentTopic,msg).subscribe(data=>{
            // if(data.response != "success"){
            //     var Toast = require("nativescript-toast");
            //     var toast = Toast.makeText("Unable to submit. Please try again!.");
            //     toast.show();
            // }
            // else{
                console.log("sent message");
                let dateTime = new Date();
                this.messages.push({
                    answer:msg,
                    userName:this.loggedInUser,
                    time:dateTime
                })
                    this.scrollToBottom();
                // this.message="";
            
        },error=>{
            var Toast = require("nativescript-toast");
                var toast = Toast.makeText("Unable to submit. Please try again!.");
                toast.show();
        })
    }

    unsubTopic(){
        this.msgsvc.unsubFromTopic(this.loggedInUser,this.currentTopic).subscribe(data=>{
            // if(data.response === 'success'){
                firebase.unsubscribeFromTopic(this.currentTopic)
                .then(()=>{
                    console.log("unsubscribed");
                    var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Discussion Exited!");
                    toast.show();
                    this.goBack();
                })
                .catch(error=>{
                    console.log(error);
                });
            // }
            // else{
            //     var Toast = require("nativescript-toast");
            //     var toast = Toast.makeText("Unable to delete.Please try again later!");
            //     toast.show();
            // }
        },error=>{
            var Toast = require("nativescript-toast");
                var toast = Toast.makeText("Unable to delete.Please try again later!");
                toast.show();
        }
        );
    }

    ngOnDestroy(){
        this.msgState.resetTopic();
        clearInterval(this.timerset);
    }
    
    goBack(){
        this.router.navigate(["/welcome"],{ clearHistory : true , queryParams:{lastRoute: 'msg' } });
    }
}
