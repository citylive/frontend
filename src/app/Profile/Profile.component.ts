import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import * as firebase from 'nativescript-plugin-firebase';
import { EventData } from "tns-core-modules/ui/page/page";
import { MessageService } from "../Services/messages.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Profile", loadChildren: "./Profile/Profile.module#ProfileModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Profile",
    moduleId: module.id,
    templateUrl: "./Profile.component.html",
    styleUrls: ["./Profile.component.css"]
})
export class ProfileComponent implements OnInit {

    LS = require( "nativescript-localstorage" );
    user={
        userName:"",
        email:"",
    }


    locationName;

    deviceId="";

    devIdEditable=false;
    loggingOut=false;
    
    constructor(private router:RouterExtensions,private userSvc:AuthorizeRegisterService,private msgSvc:MessageService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       let usernm=this.LS.getItem('LoggedInUser');
       this.userSvc.getUser(usernm).subscribe((data:any)=>{
           this.user=data;
       })

       geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
       .then(location=>{
           this.userSvc.getLocationName(location.latitude,location.longitude).subscribe((data:any)=>{
                console.log('location',data);
                this.locationName=data.staddress+' ,'+data.city+' ,'+data.prov;
           })
        });
          
       firebase.getCurrentPushToken()
       .then(token=>{
           this.deviceId=token;
       })

    }

    changeLiveStatus(){
            var LS = require( "nativescript-localstorage" );
            let livePref = LS.getItem('livePref');
                    
            if(livePref != 'live' || livePref != 'notlive'){
                let msg="To be LIVE always, a notification needs to be on always. You can click on the notification to force stop the app. You can always change your preference from the profile tab.\n\nFor Android 10+, please give access to location even when app is in background for best performance. Please change the permissions from settings if not done already."
                dialogs.confirm({
                    title: "Would you like to be LIVE always?",
                    message: msg,
                    okButtonText: "Stay LIVE",
                    cancelButtonText: "No",
                }).then(result => {
                    // result argument is boolean
                    if(result != undefined){
                        if(result){
                            LS.setItem('livePref','live');
                        }
                        else{
                            LS.setItem('livePref','notlive');
                        }
                    }
                    else{
                        LS.setItem('livePref','notlive');
                    }
                    this.router.navigate(['/welcome'],{ clearHistory: true ,queryParams:{ livePref: result?'live':'notlive' } });
                });
            }
        }

    logOut(){
        console.log('setting values');
        this.loggingOut=true;
        this.msgSvc.getTopics(this.user.userName).subscribe(data=>{
            
            let topics=data.response;
            this.userSvc.doLogout().subscribe(data=>{
                topics.forEach((topicObj,index)=>{
                    firebase.unsubscribeFromTopic(topicObj.topic)
                    .then(topic=>{
                        console.log("UnSubscribed to",topic);
                        if(index+1 == topics.length){
                            this.LS.setItem('LoggedInUser','');
                            this.LS.setItem('currentQueries','');
                            this.LS.setItem('msgCountMap','');
                            this.LS.setItem('msgCountMapNotif','');
                            this.LS.setItem('newNotif','');
                            this.LS.setItem('livePref','');
                            this.LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
                            this.loggingOut=false;
                            this.router.navigate(['/login'],{ clearHistory: true });
                        }
                    });
                    
                })
            })
            
        })
        
    }

}
