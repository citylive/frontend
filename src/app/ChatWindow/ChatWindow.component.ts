import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { RouterExtensions } from "nativescript-angular";
import { MessageService } from "../Services/messages.service";
import { MsgChatStateService } from "../Services/chat.message.state.service";
import * as dialogs from "tns-core-modules/ui/dialogs";


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
    styleUrls: ["./ChatWindow.component.css"]
})
export class ChatWindowComponent implements OnInit,OnDestroy {

    currentTopic;
    messages=[];
    loggedInUser="";
    question="";
    message="";

    @ViewChild("scrollView", { static: false }) scrollView: ElementRef;

    constructor(private ngZone:NgZone,private route:ActivatedRoute,private router:RouterExtensions,private msgsvc:MessageService,private msgState:MsgChatStateService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       console.log("constructor")
       
    }
    onKeyBoard(){
        console.log("keyboard",this.scrollView.nativeElement);
        
    }

    offKeyBoard(){
        console.log("No keyboard");
        
    }

    scrollToBottom(){
        this.scrollView.nativeElement.scrollToVerticalOffset(this.scrollView.nativeElement.scrollableHeight, false);
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        console.log('Initing');
        var LS = require( "nativescript-localstorage" );
        this.loggedInUser = LS.getItem('LoggedInUser');

        this.route.queryParams.subscribe(params => {
            this.question=params.question;
            this.currentTopic= params.topic;
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
        this.msgsvc.getAllMessages(this.currentTopic).subscribe(data=>{
            this.messages=data.response;
        })
    }

    addNextMsg(){
        let newMsg=this.msgState.newMsg;
        console.log("new msg rec",newMsg);
        if(newMsg.message.length>0){
            this.messages.push(newMsg);
            this.scrollToBottom();
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
        if(this.message.length == 0){
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText("Can't send empty message");
            toast.show();
            return;
        }
        this.msgsvc.addAnswer(this.loggedInUser,this.currentTopic,this.message).subscribe(data=>{
            if(data.response != "success"){
                var Toast = require("nativescript-toast");
                var toast = Toast.makeText("Unable to submit. Please try again!.");
                toast.show();
            }
            else{
                this.message="";
            }
        })
    }

    unsubTopic(){
        firebase.unsubscribeFromTopic(this.currentTopic)
        .then(()=>{
            console.log("unsubscribed");
        })
        .catch(error=>{
            console.log(error);
        })
    }

    ngOnDestroy(){
        this.msgState.resetTopic();
    }
    
    goBack(){
        this.router.navigateByUrl("/welcome");
    }
}
