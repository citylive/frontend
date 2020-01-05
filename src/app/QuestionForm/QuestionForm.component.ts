import { Component, OnInit } from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "QuestionForm", loadChildren: "./QuestionForm/QuestionForm.module#QuestionFormModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "QuestionForm",
    moduleId: module.id,
    templateUrl: "./QuestionForm.component.html"
})
export class QuestionFormComponent implements OnInit {

    latitude;
    longitude;

    constructor() {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
    }



    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
       geolocation.enableLocationRequest()
       .then(()=>{
            geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
            .then((location)=>{
                this.latitude=location.latitude;
                this.longitude=location.longitude
            })
       });
    }
}
