import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Welcome", loadChildren: "./Welcome/Welcome.module#WelcomeModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Welcome",
    moduleId: module.id,
    templateUrl: "./Welcome.component.html"
})
export class WelcomeComponent implements OnInit {

    constructor(private router:RouterExtensions) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }

    logOut(){
        const LS = require( "nativescript-localstorage" );
        LS.setItem('IsAlreadyLoggedIn', 'loggedOut');
        this.router.navigate(['/login']);
    }

    askQuestion(){
        this.router.navigate(['/ask']);
    }
}
