import { Component, OnInit, NgZone } from "@angular/core";
import { MessageService } from "../Services/messages.service";
import { MsgCountStateService } from "../Services/message.count.state.service";
import { NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Vibrate } from 'nativescript-vibrate';
import * as firebase from 'nativescript-plugin-firebase';

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
    msgCt$;
    msgCtState$;
    loggedInUser="";
    start;
    end;

    quesExpanded=true;
    discExpanded=true;

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
            this.setmsgCount();
          })
          console.log('change happened');
       });
    }

    getMessageTopics(){
        this.msgSvc.getTopics(this.loggedInUser).subscribe(messages=>{
            this.items=messages.response;
         })
    }

    setmsgCount(){
       let msgCountMap=this.msgCountState.getAllMsgCount();
          this.items=this.items.map(item => {
             let count=msgCountMap.has(item.topic)?msgCountMap.get(item.topic):0;
             return {...item,count:count};
          });
      // console.log(this.msgCountState.getAllMsgCount());
    }

    routeToChat(index){
        if(this.selectedInd.size>0){
            this.functionWhenLongPress(index);
            return;
        }
       this.msgCountState.resetMsgTopic(this.items[index].topic);
      const navigationExtras: NavigationExtras = {
          queryParams: {
              topic: this.items[index].topic,
              question:this.items[index].question
          }   
      };
      this.router.navigate(["/chat"], navigationExtras);
  }


  functionWhenLongPress(index) {
    // your things to do when long pressed
    console.log("long press");
    if(this.selectedInd.has(index)){
        this.selectedInd.size==1?this.selectedInd.clear():this.selectedInd.delete(index);
        
    }
    else{
        let vibrator = new Vibrate();
        vibrator.vibrate(50);
        this.selectedInd.add(index);
    }
    
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
                this.selectedInd.forEach(index=>{
                    this.msgSvc.unsubFromTopic(this.loggedInUser,this.items[index].topic).subscribe(data=>{
                        if(data.response === 'success'){
                            firebase.unsubscribeFromTopic(this.items[index].topic)
                            .then(()=>{
                                this.selectedInd.delete(index);
                                if(this.selectedInd.size==0){
                                this.getMessageTopics();
                            }
                            })

                        }
                        else{
                            var Toast = require("nativescript-toast");
                            var toast = Toast.makeText("Unable to delete.Please try again later!");
                            toast.show();
                        }
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
