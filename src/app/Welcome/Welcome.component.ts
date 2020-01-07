import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from 'nativescript-plugin-firebase';
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import { QuestionStateService } from "../Services/question.state.service";
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
        
        
    constructor(private router:RouterExtensions,private authReg:AuthorizeRegisterService,private quesState:QuestionStateService) {
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
        console.log('oninit',this.loggedInUser);
        this.setDeviceId();


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

    logOut(){
        
        this.LS.setItem('LoggedInUser','');
        this.LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
        this.router.navigate(['/login']);
    }

    askQuestion(){
        this.router.navigate(['/ask']);
    }
}
