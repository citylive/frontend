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
        let url='./MockUps/true.json';
        // return this.http.getData(url);
        return of({
            response:"success"
        });
    }

    checkCredentials(user,passwd){
        return of({
            response:"sd"
        });
    }

    checkCredentialsWrong(){
        return of({
            response:"Invalid Username/Password"
        });
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
        return of({
            response:"success"
        });
    }

    getUser(usernm:string){
        return of({
            response:{
                username:"soumyadc",
                email:"soumya.c11@gmail.com",
                currentLocation:"Kadubeesanahalli,Bangalore"
            }
        });
    }

}