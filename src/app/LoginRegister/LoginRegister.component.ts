import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "LoginRegister", loadChildren: "./LoginRegister/LoginRegister.module#LoginRegisterModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "LoginRegister",
    moduleId: module.id,
    templateUrl: "./LoginRegister.component.html",
    styleUrls: ["./LoginRegister.component.css"]
})
export class LoginRegisterComponent implements OnInit {

    isLogin=true;
    email='';
    pwd='';
    cnfpwd='';
    usernm='';
    otp='';

    constructor(private router:RouterExtensions) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       const LS = require( "nativescript-localstorage" );
       if(LS.getItem('IsAlreadyLoggedIn') === 'loggedIn'){
        this.router.navigate(['/welcome']);
       }
    }

    loginRegToogle(){
        console.log(this.isLogin);
        this.isLogin=!this.isLogin;
    }

    onLoginRegister(){
        console.log(this.email,this.pwd);
        const LS = require( "nativescript-localstorage" );
        LS.setItem('IsAlreadyLoggedIn', 'loggedIn');
        this.router.navigate(['/welcome']);
    }
}
