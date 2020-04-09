import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import { NavigationExtras } from "@angular/router";


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
    otpSent=false;
    isCalling=false;
    email='';
    pwd='';
    cnfpwd='';
    usernm='';
    otp='';

    formHgt=300;
    logoHgt=200;


    constructor(private router:RouterExtensions,private authRegSvc:AuthorizeRegisterService) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       this.setformHgt();
        const LS = require( "nativescript-localstorage" );
       if(LS.getItem('IsAlreadyLoggedIn') === 'loggedIn'){
        this.router.navigate(['/welcome'],{ clearHistory : true ,queryParams:{lastRoute: 'login', livePref: 'login' }});
       }
    }

    setformHgt(){
        const platformModule = require("tns-core-modules/platform");
        this.logoHgt=160;
        this.formHgt=Math.min(platformModule.screen.mainScreen.heightDIPs-370,450);
       if(this.formHgt<330){
           this.formHgt=330;
           this.logoHgt=0;
       }
    }

    loginRegToogle(){
        this.isLogin=!this.isLogin;
        this.pwd='';
        this.usernm='';
        this.email='';
        this.cnfpwd='';
        this.otpSent=false;
    }

    onFocus(){
        this.logoHgt=0;
    }

    onBlur(){
        this.setformHgt();
    }

    onLoginRegister(){
        if(this.isLogin){

            if(this.usernm == '' || this.pwd == ''){
                var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Fields can't be Empty!");
                    toast.show();
                return;
            }
            this.isCalling=true;
            this.authRegSvc.checkCredentials(this.usernm,this.pwd).subscribe(data=>{
            // },error=>{
                // if(error.status == 404){
                    const LS = require( "nativescript-localstorage" );
                    LS.setItem('LoggedInUser', this.usernm);
                    LS.setItem('Password', this.pwd);
                    LS.setItem('IsAlreadyLoggedIn', 'loggedIn');
                    this.router.navigate(['/welcome'],{ clearHistory : true ,queryParams:{ lastRoute: 'login',livePref: 'login' }});
                
                },error=>{
                    var Toast = require("nativescript-toast");
                    var toast = Toast.makeText("Invalid Credentials");
                    toast.show();
                    this.isCalling=false;
                }
            );
        }
        else{
            console.log(this.email,this.pwd,this.usernm,this.cnfpwd);
            var Toast = require("nativescript-toast");
                        
            if(this.email == '' || this.pwd == '' || this.usernm == '' || this.cnfpwd == ''){
                var toast = Toast.makeText("Fields can't be blank");
                toast.show();
                return;
            }
            else if(this.pwd != this.cnfpwd){
               var toast = Toast.makeText("Passwords don't match");
                toast.show();
                return;
            }
            else if(!this.otpSent){
                this.authRegSvc.sendOTP({email:this.email,username:this.usernm,password:this.pwd}).subscribe((data:any)=>{
                    if(data.Status == "OTP-SENT"){
                        var toast = Toast.makeText("OTP Sent to mail id");
                        toast.show();
                        this.otpSent=true;
                    }
                    else if(data.Status == "USER_EXISTS"){
                        var toast = Toast.makeText("Username altready exists");
                        toast.show();
                    }
                    else if(data.Status == "EMAIL_EXISTS"){
                        var toast = Toast.makeText("Email already in use");
                        toast.show();
                    }
                },
                error=>{
                    var toast = Toast.makeText("Unable to send OTP. Please try again!");
                        toast.show();
                })
                
            }
            else{
                this.isCalling=true;
                this.authRegSvc.registerUser({email:this.email,username:this.usernm,password:this.pwd},this.otp).subscribe((data:any) => {
                       var toast = Toast.makeText("Registered. Please Login to continue.");
                        toast.show();
                        this.isCalling=false;
                        this.isLogin=true;
                        this.pwd='';
                        this.otpSent=false;
                    },error=>{
                        var toast = Toast.makeText(error.message);
                        toast.show();
                        this.isCalling=false;
                    }
                );
            }
        }
        
    }
}
