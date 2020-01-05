import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationExtras } from "@angular/router";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "AnswerForm", loadChildren: "./AnswerForm/AnswerForm.module#AnswerFormModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "AnswerForm",
    moduleId: module.id,
    templateUrl: "./AnswerForm.component.html"
})
export class AnswerFormComponent implements OnInit {
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

    routeToChat(){
        const navigationExtras: NavigationExtras = {
            queryParams: {
                topic: 'soumyadip12345'
            }   
        };
        this.router.navigate(["/chat"], navigationExtras);
    }

}
