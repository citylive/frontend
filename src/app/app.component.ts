import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import * as firebase from 'nativescript-plugin-firebase';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { setInterval, clearInterval ,setTimeout} from "tns-core-modules/timer";
import * as application from "tns-core-modules/application";
import { HttpService } from "./Services/http.service";
import { AuthorizeRegisterService } from "./Services/authorize-register.service";
import { NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { QuestionStateService } from "./Services/question.state.service";

import { CardView } from '@nstudio/nativescript-cardview';
import { registerElement } from 'nativescript-angular';

registerElement('CardView', () => CardView as any);


@Component({
  selector: "ns-app",
  moduleId: module.id,
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit,OnDestroy {

  currLocation={
    lat:0,
    lon:0
  }

  constructor(private ngZone: NgZone,private authReg:AuthorizeRegisterService,private router:RouterExtensions,private quesState:QuestionStateService){

  }

  ngOnInit(): void {

    this.startLocationWatcher();
    this.startForegroundService();

    firebase.init({
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
      },

      onMessageReceivedCallback: (message: firebase.Message) => {
        this.onReceivedMessage(message);
      }
    })
      .then(() => {
        console.log('[Firebase] Initialized');
      })
      .catch(error => {
        console.log('[Firebase] Initialize', { error });
      });

      geolocation.enableLocationRequest(true,true)
       .then(()=>{
        });

  }

  getCurrToken(){
    firebase.getCurrentPushToken()
    .then(token => console.log(`Current push token: ${token}`));
  }

  onReceivedMessage(message){

          if(message.data.type === 'ques'){
            console.log('is ques');
            this.quesState.addQues({
              question:"this is new ques",
              by:"Soumyadip"
            });
          }
          else if(message.data.type === 'chat'){
            console.log('is chat s');
          }
  }


  private startForegroundService() {
    const context = application.android.context;
    const intent = new android.content.Intent();
    intent.setClassName(context, 'com.citylive.ver1.ForegroundService');
    const id=context.startForegroundService(intent);
    }

  startLocationWatcher(){
    this.checkAndSetLocation()

    let id = setInterval(() => {
      this.checkAndSetLocation();
    },1000*60*5);

   
  }

  checkAndSetLocation(){
    if(geolocation){
      geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
      .then(location=>{
          if(this.isMajorDiff(location.latitude,this.currLocation.lat,location.longitude,this.currLocation.lon)){
            this.authReg.updateLocation(location.latitude,location.longitude).subscribe(data=>{
              console.log(data.response);
              if(data.response === 'success'){
                this.currLocation={
                  lat:location.latitude,
                  lon:location.longitude
                };
              }
            });
            
          }
      })
    }
  
  }
  
  isMajorDiff(lat1:number,lat2:number,lon1:number,lon2:number){
      var R = 6371e3; // metres
      var φ1 = this.toRadians(lat1);
      var φ2 = this.toRadians(lat2);
      var Δφ = this.toRadians(lat2-lat1);
      var Δλ = this.toRadians(lon2-lon1);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      
      var d = R * c;

      console.log(d,' ',lat1,lat2,lon1,lon2);

      return d>200;

  }

  toRadians(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

  ngOnDestroy(){
    
  }

}