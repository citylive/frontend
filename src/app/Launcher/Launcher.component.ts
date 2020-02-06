import { Component, OnInit } from "@angular/core";
import { AuthorizeRegisterService } from "../Services/authorize-register.service";
import { RouterExtensions } from "nativescript-angular";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "Launcher", loadChildren: "./Launcher/Launcher.module#LauncherModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Launcher",
    moduleId: module.id,
    templateUrl: "./Launcher.component.html",
    styleUrls: ["./Launcher.component.css"]
})
export class LauncherComponent implements OnInit {
    constructor(private authServ:AuthorizeRegisterService,private router:RouterExtensions,) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       this.checkConnectivity();
        
    }

    checkConnectivity(){
        var LS = require( "nativescript-localstorage" );
        let loggedInUser = LS.getItem('LoggedInUser');
        let password = LS.getItem('Password');
        if(loggedInUser && loggedInUser!='' && loggedInUser!=null && password && password!='' && password!=null ){
        this.authServ.checkCredentials(loggedInUser,password).subscribe(data=>{
                this.router.navigate(["/welcome"],{ clearHistory : true,queryParams:{lastRoute: 'launcher' } });
            },
            error=>{
                this.router.navigate(['/login'],{ clearHistory: true });
            });
        }
        else{
            this.router.navigate(['/login'],{ clearHistory: true });
        }
        
    }
}
