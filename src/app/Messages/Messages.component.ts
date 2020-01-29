import { Component, OnInit, NgZone } from "@angular/core";
import { MessageService } from "../Services/messages.service";
import { MsgCountStateService } from "../Services/message.count.state.service";
import { NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Vibrate } from 'nativescript-vibrate';
import * as firebase from 'nativescript-plugin-firebase';

import {SwipeGestureEventData} from 'tns-core-modules/ui/gestures'

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Messages", loadChildren: "./Messages/Messages.module#MessagesModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Messages",
    moduleId: module.id,
    templateUrl: "./Messages.component.html",
    styleUrls: ["./Messages.component.css"]
})
export class MessagesComponent implements OnInit {

    items=[];
    numbertopicsMap:Map<string,number>=new Map([]);
    topicsMap:Map<number,any>=new Map([]);
    msgCt$;
    msgCtState$;
    loggedInUser="";
    start;
    end;

    largeNumber=9999999;

    quesExpanded=true;
    discExpanded=true;
    showRefresh=false;
    deleting=false;

    selectedInd:Set<number>=new Set([]);
    

    constructor(private ngZone: NgZone ,
        private msgSvc:MessageService,private msgCountState:MsgCountStateService,private router:RouterExtensions) {
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
         this.getMessageTopics();
         this.msgCt$=this.msgCountState.$quesList;

       this.msgCt$.subscribe(data=>{
          this.ngZone.run(()=>{
            // this.setmsgCount();
            this.updateCount();
          })
          console.log('change happened');
       });
    }

    cometoMessages(){
        console.log('Come to messages');
        this.showRefresh=true;
    }

    goOutFromMessages(){
        this.showRefresh=false;
        this.selectedInd=new Set([]);
    }

    onRefresh(){
        this.getMessageTopics();
    }

    getMessageTopics(){
        this.largeNumber = 9999999;

        this.topicsMap = new Map([]);
        this.numbertopicsMap = new Map([]);
        this.msgSvc.getTopics(this.loggedInUser).subscribe((messages:any)=>{
            this.items=messages;
            console.log('topics array received',messages,this.items,this.items.length)
            this.items.forEach((item,index)=>{
                this.numbertopicsMap.set(item.topicId.toString(),this.largeNumber)
                this.topicsMap.set(this.largeNumber,item);
                this.largeNumber--;
                if(index+1 == this.items.length){
                    this.setmsgCount();
                }
            })
         })
    }

    setmsgCount(){
       let msgCountMap=this.msgCountState.getAllMsgCount();
        //   this.items=this.items.map((item,index) => {
        //      let count=msgCountMap.has(item.topic)?msgCountMap.get(item.topic):0;
        //      console.log(index,this.items.length);
        //      return {...item,count:count};
             
        //   });
        msgCountMap.forEach((count,key) => {
            let topicNum=this.numbertopicsMap.get(key)
            let topic=this.topicsMap.get(topicNum);
            let newTopic=Object.assign({},topic,{ count:count });
            this.topicsMap.set(topicNum,newTopic);
        });
      // console.log(this.msgCountState.getAllMsgCount());
    }

    updateCount(){
        console.log('Updating count');
        let key=this.msgCountState.lastRecTopics;
        let topicNum=this.numbertopicsMap.get(key);
        let topic=this.topicsMap.get(topicNum);
        console.log('Updating count',topicNum,topic);
        if(topicNum){
            let count=this.msgCountState.getCurrCount(topic.topicId.toString());
            let newTopic=Object.assign({},topic,{ count:count?count:0 });
            this.topicsMap.delete(topicNum);
            this.numbertopicsMap.set(key,this.largeNumber);
            this.topicsMap.set(this.largeNumber,newTopic);
            this.largeNumber--;
        }
        
    }


    routeToChat(key){
        if(this.selectedInd.size>0){
            this.functionWhenLongPress(key);
            return;
        }
        let topic=this.topicsMap.get(key).topicId.toString();
        let ques=this.topicsMap.get(key).question;
       this.msgCountState.resetMsgTopic(topic);
      const navigationExtras: NavigationExtras = {
          queryParams: {
              topic: topic,
              question:ques
          }   
      };
      this.router.navigate(["/chat"], navigationExtras);
  }


  functionWhenLongPress(key) {
    // your things to do when long pressed
    console.log("long press");
    if(this.selectedInd.has(key)){
        this.selectedInd.size==1?this.selectedInd.clear():this.selectedInd.delete(key);
        
    }
    else{
        let vibrator = new Vibrate();
        vibrator.vibrate(50);
        this.selectedInd.add(key);
    }
    
  }

  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe Direction: " + args.direction);
}

  onDelete(){
    dialogs.confirm({
        title: "Delete Selected Discussions?",
        message: "Are you sure you want to delete and unsubscribe from the discussion?",
        okButtonText: "Delete",
        cancelButtonText: "Cancel",
    }).then(result => {
        // result argument is boolean
        if(result != undefined){
            if(result){
                this.deleting=true;
                
                this.selectedInd.forEach(key=>{
                    let topic=this.topicsMap.get(key).topicId.toString();
                    this.msgSvc.unsubFromTopic(this.loggedInUser,topic).subscribe(data=>{
                        // if(data.response === 'success'){
                            firebase.unsubscribeFromTopic(topic)
                            .then(()=>{
                                this.selectedInd.delete(key);
                                if(this.selectedInd.size==0){
                                this.getMessageTopics();
                                this.deleting=false;
                            }
                            })

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
                    });
                  
                })
            }
        }
        
    });
     
  }

  onCancel(){
    this.selectedInd.clear();
  }



}
