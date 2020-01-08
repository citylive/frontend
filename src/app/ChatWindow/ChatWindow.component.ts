import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { RouterExtensions } from "nativescript-angular";

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

    constructor(private route:ActivatedRoute,private router:RouterExtensions) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       console.log("constructor")
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       console.log('Initing');
       this.route.queryParams.subscribe(params => {
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
    }

    ngOnDestroy(){
        firebase.unsubscribeFromTopic(this.currentTopic)
        .then(()=>{
            console.log("unsubscribed");
        })
        .catch(error=>{
            console.log(error);
        })
    }

    
    goBack(){
        this.router.navigateByUrl("/welcome");
    }
}
