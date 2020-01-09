import { Component, OnInit, NgZone } from "@angular/core";
import { MessageService } from "../Services/messages.service";
import { MsgCountStateService } from "../Services/message.count.state.service";
import { NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";

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


    constructor(private ngZone: NgZone ,private msgSvc:MessageService,private msgCountState:MsgCountStateService,private router:RouterExtensions) {
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
         this.msgSvc.getTopics(this.loggedInUser).subscribe(messages=>{
            this.items=messages.response;
         })
         this.msgCt$=this.msgCountState.$quesList;

       this.msgCt$.subscribe(data=>{
          this.ngZone.run(()=>{
            this.setmsgCount();
          })
          console.log('change happened');
       });
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
       this.msgCountState.resetMsgTopic(this.items[index].topic);
      const navigationExtras: NavigationExtras = {
          queryParams: {
              topic: this.items[index].topic,
              question:this.items[index].question
          }   
      };
      this.router.navigate(["/chat"], navigationExtras);
  }
}
