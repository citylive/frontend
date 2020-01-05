import { Component, OnInit } from "@angular/core";
import * as firebase from 'nativescript-plugin-firebase';

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