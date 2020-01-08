import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { User, Question } from "./Models";

import { Observable,of } from "rxjs";
import 'rxjs/add/observable/of';
import { IQuestion } from "./question.state.service";





@Injectable(
    {
       providedIn: "root"
    }
)
export class MessageService {

    constructor(private http:HttpService){

    }

    getAdMessages(user:string){
        console.log(user);
        let url='./MockUps/true.json';
        // return this.http.getData(url);
        return of([{
            imgUrl:"https://i.postimg.cc/q7tbqWKR/lance-anderson-uevmkf-CH98-Q-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad content"
        },
        {
            imgUrl:"https://i.postimg.cc/X74kcNNy/pedro-lastra-Nyvq2juw4-o-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad "
        },
        {
            imgUrl:"https://i.postimg.cc/q7tbqWKR/lance-anderson-uevmkf-CH98-Q-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad content"
        },
        {
            imgUrl:"https://i.postimg.cc/X74kcNNy/pedro-lastra-Nyvq2juw4-o-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad "
        },
        {
            imgUrl:"https://i.postimg.cc/q7tbqWKR/lance-anderson-uevmkf-CH98-Q-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad content"
        },
        {
            imgUrl:"https://i.postimg.cc/X74kcNNy/pedro-lastra-Nyvq2juw4-o-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad "
        },{
            imgUrl:"https://i.postimg.cc/q7tbqWKR/lance-anderson-uevmkf-CH98-Q-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad content"
        },
        {
            imgUrl:"https://i.postimg.cc/X74kcNNy/pedro-lastra-Nyvq2juw4-o-unsplash.jpg",
            title:"This is an Ad",
            content:"this is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad contentthis is Ad "
        }]);
    }

    getTopics(user:User){
        console.log(user);
        let url='./MockUps/true.json';
        // return this.http.getData(url);
        return of([{
            topic:"soumyadip12345",
            question:"This is a Question",
            by:"this is Ad content",
            closed:false
        },
        {
            topic:"soumyadip12345",
            question:"This is a closed Question",
            by:"this is Ad content",
            closed:true
        }]);
    }

    askQuestion(question:Question){
        console.log(question);
        return of({
            topicId:"soumyadip12345"
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

}