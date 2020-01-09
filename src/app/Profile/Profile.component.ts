import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { AuthorizeRegisterService } from "../Services/authorize-register.service";

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
        username:"",
        email:"",
        currentLocation:""
    }
    constructor(private router:RouterExtensions,private userSvc:AuthorizeRegisterService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/

    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       let usernm=this.LS.getItem('LoggedInUser');
       this.userSvc.getUser(usernm).subscribe(data=>{
           this.user=data.response;
       })
    }
    logOut(){
        console.log('setting values');
        this.LS.setItem('LoggedInUser','');
        this.LS.setItem('currentQueries','');
        this.LS.setItem('msgCountMap','');
        this.LS.setItem('msgCountMapNotif','');
        this.LS.setItem('newNotif','');
        this.LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
        this.router.navigate(['/login']);
    }

}
