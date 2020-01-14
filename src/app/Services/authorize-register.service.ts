import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./Models";

import { Observable,of } from "rxjs";
import 'rxjs/add/observable/of';


@Injectable(
    {
       providedIn: "root"
    }
)
export class AuthorizeRegisterService {

    constructor(private http:HttpService){

    }

    initCall(){
        let url='login?username=radhe&password=admin'
        return this.http.postData(url,{});
    }

    testEndPointCall(){
        let url='user/all';
        return this.http.getData(url);
    }

   

    registerUser(user:User){
        console.log(user);
        let url='./MockUps/true.json';
        // return this.http.getData(url);
        return of({
            response:"success"
        });
    }

    updateLocation(lat:number,long:number,user:string){
        console.log(lat,long);
        let url='https://citylive.free.beeceptor.com';
        // return this.http.getData(url);
        return of({
            response:"success"
        });
    }

    checkCredentials(user,passwd){
        let url='login?username='+user+'&password='+passwd;
        return this.http.postData(url,{});
        // return of({
        //     response:"radhe"
        // });
    }

    doLogout(){
        let url='logout';
        return this.http.postData(url,{});
    }

    updateDeviceId(){
        return of({
            response:"success"
        });
    }

    getDeviceId(usernm){
        return of({
            response:"dxVeB7oD6yI:APA91bFfbrWxZKZoY0XBmQ8TGHu2UMZQcg5GEKol1RBx_A5Cl3A_HHqo46UmBgb1rBEac4noQiY9vv5DvjR5ZFm32W-gr6qIMZ3xZnKzY3HBQODHKebMIWlnhwCff3KiFlj1dCSZEEHP"
        });
    }

    setDeviceId(usernm,id){

        let url='user/update/deviceId?userName='+usernm+'&deviceId='+id;
        return this.http.putData(url,{});
        // return of({
        //     response:"success"
        // });
    }

    getUser(usernm:string){
        let url='user/find?userName='+usernm;
        return this.http.getData(url);
        // return of({
        //     response:{
        //         username:"soumyadc",
        //         email:"soumya.c11@gmail.com",
        //         currentLocation:"Kadubeesanahalli,Bangalore"
        //     }
        // });
    }

    getLocationName(lat:number,long:number){
        // let url='https://geocode.xyz/'+lat+','+long+'?geoit=json';
        return this.http.getLocationName(lat,long);
    }

}