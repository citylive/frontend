import { Component, OnInit } from "@angular/core";
import * as firebase from 'nativescript-plugin-firebase';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";

@Component({
  selector: "ns-app",
  moduleId: module.id,
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

  ngOnInit(): void {

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
            geolocation.watchLocation(location=>{
                console.log(location.latitude,location.longitude)
            },error=>{

            },{updateDistance: 5, minimumUpdateTime:1000,desiredAccuracy:Accuracy.high,iosAllowsBackgroundLocationUpdates:true,iosPausesLocationUpdatesAutomatically:false});
       });

  }

  getCurrToken(){
    firebase.getCurrentPushToken()
    .then(token => console.log(`Current push token: ${token}`));
  }

  onReceivedMessage(message){
        if(message.foreground){
            console.log("Should add notif");
        }
        else{
            console.log("open answerPage");
        }
        console.log(message.data);
  }

}