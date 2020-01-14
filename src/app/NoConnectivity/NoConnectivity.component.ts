import { Component, OnInit } from "@angular/core";
import * as connectivity from "tns-core-modules/connectivity";
import { RouterExtensions } from "nativescript-angular";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "NoConnectivity", loadChildren: "./NoConnectivity/NoConnectivity.module#NoConnectivityModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "NoConnectivity",
    moduleId: module.id,
    templateUrl: "./NoConnectivity.component.html",
    styleUrls: ["./NoConnectivity.component.css"]
})
export class NoConnectivityComponent implements OnInit {

    showButton=true;
    
    constructor(private router:RouterExtensions,) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }
   
    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }

    retryConnection(){
        this.showButton=false;
        switch (connectivity.getConnectionType()) {
            case connectivity.connectionType.none:
                this.showButton=true;
                console.log("No connection");
                break;
            default:
                this.router.navigate(["/launch"],{ clearHistory : true });
                break;
          }
    }

}
