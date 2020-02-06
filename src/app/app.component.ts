import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import * as firebase from 'nativescript-plugin-firebase';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { setInterval, clearInterval ,setTimeout} from "tns-core-modules/timer";
import * as application from "tns-core-modules/application";
import { HttpService } from "./Services/http.service";
import { AuthorizeRegisterService } from "./Services/authorize-register.service";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { QuestionStateService } from "./Services/question.state.service";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as connectivity from "tns-core-modules/connectivity";

import {LocalNotifications} from "nativescript-local-notifications";

import { Vibrate } from 'nativescript-vibrate';
import { CardView } from '@nstudio/nativescript-cardview';
import { registerElement } from 'nativescript-angular';
import { MsgCountStateService } from "./Services/message.count.state.service";
import { MsgChatStateService } from "./Services/chat.message.state.service";

import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";
import { MessageService } from "./Services/messages.service";


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

  currTimer;

  quesTimer;
  chatTimer;

  backPressedOnce=false;


  type = connectivity.getConnectionType();

    

  constructor(private ngZone: NgZone,
    private authReg:AuthorizeRegisterService,private router:RouterExtensions,private actRoute:ActivatedRoute,
    private quesState:QuestionStateService,private msgCountState:MsgCountStateService,private msgChatState:MsgChatStateService,
    private msgsvc:MessageService){

  }

  ngOnInit(): void {

    LocalNotifications.hasPermission();
    LocalNotifications.addOnMessageReceivedCallback(
      (notification)=> {
        console.log("ID: " + notification.id);
        console.log("Title: " + notification.title);
        console.log("Body: " + notification.body);
        this.openChat(notification.id);
       
  }
  ).then(()=>{
        
      }
  )

 

    this.actRoute.queryParams.subscribe(data=>{
      if(!data.hasOwnProperty('liveref')){
        console.log('Not Welcome link');
      }
      if(data.livePref == 'live'){
        this.startForegroundService();
      }
      else if(data.livePref == 'notlive'){
        this.stopForegroundService();
      }
      else if(data.livePref == 'login'){
        this.getForeGroundPermission();
      }
    })

    switch (this.type) {
      case connectivity.connectionType.none:
          console.log("No connection");
          this.router.navigate(["/noConn"],{ clearHistory : true });
          break;
      default:
          break;
    }

    connectivity.startMonitoring((newConnectionType) => {
      switch (newConnectionType) {
          case connectivity.connectionType.none:
              console.log("Connection type changed to none.");
              this.router.navigate(["/noConn"],{ clearHistory : true });
              break;
          default:
              break;
      }
  });


  
    // this.startForegroundService();
    this.quesState.setFromStorage();
    this.msgCountState.setFromStorage();

    var LS = require( "nativescript-localstorage" );
    let livePref = LS.getItem('livePref');
    console.log('livepref value', livePref);
            
    if(livePref == 'live'){
        this.startForegroundService();
      }
    


    firebase.init({
      showNotifications: true,
      showNotificationsWhenInForeground: true,
      

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
      },

      // onMessageReceivedCallback: (message: firebase.Message) => {
      //   this.onReceivedMessage(message);
      // }
    })
      .then(() => {
        console.log('[Firebase] Initialized');
      })
      .catch(error => {
        console.log('[Firebase] Initialize', { error });
      });

      firebase.addOnMessageReceivedCallback((message: firebase.Message) => {
            console.log(this.router.router.url);
                   
            this.onReceivedMessage(message);
          })

      geolocation.enableLocationRequest(true,true)
       .then((result)=>{
         
        });
    
        this.startLocationWatcher();
        this.setBackButton();
        
  }

  openChat(topic,time?){
    console.log("chat open");
    this.ngZone.run(()=>{
      let navigationExtras: NavigationExtras = {
        queryParams: {
            topic: topic,
            time: time?time:new Date(),
            key:Math.random()
        }  
      };
      this.router.navigate(["/chat"], navigationExtras);
  });
  }


  showNotif(title:string,by:string,content:string,ticker:number){
    LocalNotifications.getScheduledIds().then((ids:number[])=>{
        content=ids.indexOf(ticker) < 0? content : 'New Messages';
        by=ids.indexOf(ticker) < 0? 'by ' + by : 'Click to open chat';
        LocalNotifications.schedule([{
          id:ticker,
          title: title,
          subtitle:by,
          body: content,
          priority:2,
          ongoing: false, // makes the notification ongoing (Android only)
          icon: 'res://ic_citylive_monoicon',
          thumbnail: true,
          channel: 'My Channel', // default: 'Channel'
          sound: "~/app/sounds/when.mp3", // falls back to the default sound on Android
          }]).then(
            function(scheduledIds) {
              console.log("Notification id(s) scheduled: " + JSON.stringify(scheduledIds));
            },
            function(error) {
              console.log("scheduling error: " + error);
            }
        )
    })
    
  }


  setBackButton(){
    if (!isAndroid) {
      return;
    }
    application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
      console.log('back pressed');
      let notRedir=['/noConn','/welcome','/login','/launch'];
      if(notRedir.indexOf(this.router.router.url.split('?')[0]) < 0){
        console.log("back to welcome");
        data.cancel = true; // prevents default back button behavior
        this.ngZone.run(()=>{
           this.router.navigate(["/welcome"],{ clearHistory : true ,queryParams:{lastRoute:this.router.router.url.split('?')[0] == '/chat' ? 'msg' :''}});
         
          
        })
      }
      else if(notRedir.indexOf(this.router.router.url.split('?')[0]) >= 0 && !this.backPressedOnce){
        console.log("other",this.router.router.url.split('?')[0]);
            data.cancel=true;
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText("Press back again to exit");
            toast.show();
            this.backPressedOnce=true;
            setTimeout(()=>{
              this.backPressedOnce=false;
            },2000);
          
      }
      else{
       
          data.cancel=false;
        
        
      }
  });
  }


  getForeGroundPermission(){
    var LS = require( "nativescript-localstorage" );
    let msg="To be LIVE always, a notification needs to be on always. You can click on the notification to force stop the app. You can always change your preference from the profile tab.\n\nFor Android 10+, please give access to location even when app is in background for best performance. Please change the permissions from settings if not done already."
        dialogs.confirm({
              title: "Would you like to be LIVE always?",
              message: msg,
              okButtonText: "Stay LIVE",
              cancelButtonText: "No",
          }).then(result => {
              // result argument is boolean
              if(result != undefined){
                  if(result){
                    this.startForegroundService();
                    LS.setItem('livePref','live');
                  }
                  else{
                    LS.setItem('livePref','notlive');
                  }
              }
              else{
                LS.setItem('livePref','notlive');
              }
              
          });
     
    
  }

  getCurrToken(){
    firebase.getCurrentPushToken()
    .then(token => console.log(`Current push token: ${token}`));
  }

  onReceivedMessage(message){
    console.log(message.data);
          let vibrator = new Vibrate();

          var LS = require( "nativescript-localstorage" );
          let loggedInUser = LS.getItem('LoggedInUser');

          if(message.data.type === 'QUESTION' && message.data.by != loggedInUser){
            console.log('is ques',message);
            if(!message.foreground && this.router.router.url != '/launch'){
                this.ngZone.run(()=>{
                  const navigationExtras: NavigationExtras = {
                      queryParams: {
                        question:message.data.question,
                        by:message.data.by,
                        topic:message.data.topic
                      },
                  };
                  this.router.navigate(["/answer"], navigationExtras);
              });
            }
            else if(this.router.router.url == '/launch'){
              this.quesTimer=setInterval(()=>{
                if(this.router.router.url != '/launch'){
                  clearInterval(this.quesTimer);
                  this.ngZone.run(()=>{
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                          question:message.data.question,
                          by:message.data.by,
                          topic:message.data.topic
                        },
                    };
                    this.router.navigate(["/answer"], navigationExtras);
                });
                }
              },500);
            }
            else{
              vibrator.vibrate(500);
              this.quesState.addQues({
                question:message.data.question,
                by:message.data.by,
                topic:message.data.topic
              });
            }
            
          }
          else if(message.data.type === 'COUNT'){
            var Toast = require("nativescript-toast");
            var toast = Toast.makeText(message.data.message);
            toast.show();
          }
          else if(message.data.type === 'CHAT'){
            if(!message.foreground && this.router.router.url != '/launch'){
              
                this.ngZone.run(()=>{
                     if(this.msgChatState.currTopic == message.data.topic){
                        this.msgChatState.addMsg(message.data.msg,message.data.by,message.data.time,true);
                      }
                      else{
                        this.openChat(message.data.topic,message.data.time);
                      }
                      
                })
            }
            else if(this.router.router.url == '/launch'){
              this.chatTimer=setInterval(()=>{
                if(this.router.router.url != '/launch'){
                  clearInterval(this.chatTimer);
                  this.openChat(message.data.topic,message.data.time);
                }
              },500);
            }
            else if(this.msgChatState.currTopic == message.data.topic){
              this.msgChatState.addMsg(message.data.msg,message.data.by,message.data.time);
            }
            else{
              if(message.foreground){
                vibrator.vibrate(500);
              }
              
              this.msgsvc.getTopic(message.data.topic).subscribe((data:any)=>{
                console.log(data);
                let question=data.question;
                this.showNotif(question,message.data.by,message.data.msg,+message.data.topic);
            })
              
              this.msgCountState.addMsgCount(message.data.topic);
            }
            
          }
  }


  private startForegroundService() {
    const context = application.android.context;
    const intent = new android.content.Intent();
    intent.setClassName(context, 'com.citylive.ver1.ForegroundService');
    const id=context.startForegroundService(intent);
    }

    private stopForegroundService() {
      const context = application.android.context;
      const intent = new android.content.Intent();
      intent.setClassName(context, 'com.citylive.ver1.ForegroundService');
      const id=context.stopService(intent);
      }

  startLocationWatcher(){
    this.checkAndSetLocation();

    this.currTimer = setInterval(() => {
      this.checkAndSetLocation();
    },1000*60*2);

  }

  checkAndSetLocation(){
    console.log('Fetching loc');
    if(geolocation){
      geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high})
      .then(location=>{
          if(this.isMajorDiff(location.latitude,this.currLocation.lat,location.longitude,this.currLocation.lon)){
            var LS = require( "nativescript-localstorage" );
            let loggedInUser = LS.getItem('LoggedInUser');
            if(loggedInUser && loggedInUser!='' && loggedInUser!=null){
              this.authReg.updateLocation(location.latitude,location.longitude,loggedInUser).subscribe(data=>{
                console.log("location updated");
                // if(data.response === 'success'){
                //   this.currLocation={
                //     lat:location.latitude,
                //     lon:location.longitude
                //   };
                // }
                // console.log('after restCall',data);
              });
            } 
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
    clearInterval(this.currTimer);
    console.log('destroyed');
  //   let quesStr:string=JSON.stringify(this.quesState.getAllNewQues());
  //   let newNotifStr:string=JSON.stringify(this.quesState.getnewNotif());

  //   let msgCountMapStr:string=JSON.stringify(Array.from(this.msgCountState.getAllMsgCount().entries()));
  //   let newMsgNotifStr:string=JSON.stringify(this.msgCountState.getnewNotif());

  //   var LS = require( "nativescript-localstorage" );
  //   LS.setItem('currentQueries',quesStr);
  //   LS.setItem('newNotif',newNotifStr);

  //   LS.setItem('msgCountMap',msgCountMapStr);
  //   LS.setItem('msgCountMapNotif',newMsgNotifStr);
  // }
  }
}