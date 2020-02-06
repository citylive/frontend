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
        return of({response:[{
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
        }]});
    }

    getTopics(user:string){
        let url='topic/user/subscription?userName='+user;
        return this.http.getData(url);
        // console.log(user);
        // let url='./MockUps/true.json';
        // return this.http.getData(url);
        // return of({response:[{
        //     topic:"soumyadip12345",
        //     question:"This is a Question",
        //     by:"soumyadc",
        //     closed:false
        // },
        // {
        //     topic:"zsoumyadip1234",
        //     question:"zThis is a closed Question",
        //     by:"sd",
        //     closed:true
        // },
        // {
        //     topic:"xsoumyadip123",
        //     question:"xThis is a Question",
        //     by:"soumyadc",
        //     closed:false
        // },
        // {
        //     topic:"ysoumyadip12",
        //     question:"yThis is a closed Question with very many line of question",
        //     by:"sd",
        //     closed:true
        // },
        // {
        //     topic:"tsoumyadip1",
        //     question:"tThis is a Question",
        //     by:"soumyadc",
        //     closed:false
        // },
        // {
        //     topic:"vsoumyadip4",
        //     question:"vThis is a closed Question",
        //     by:"sd",
        //     closed:true
        // },
        // {
        //     topic:"usoumyadip12",
        //     question:"uThis is a closed Question with very many line of question",
        //     by:"sd",
        //     closed:true
        // },
        // {
        //     topic:"wsoumyadip1",
        //     question:"wThis is a Question",
        //     by:"soumyadc",
        //     closed:false
        // },
        // {
        //     topic:"soumyadip4",
        //     question:"This is a closed Question",
        //     by:"sd",
        //     closed:true
        // },]});
    }

    askQuestion(question:Question){
        let url='topic';
        let data={
            "userName": question.askedby,
            "question": question.question,
            "latitude": question.latitude,
            "longitude": question.longitude
        };
            return this.http.postData(url,data);

        // console.log(question);
        // return of({
        //     topicId:"soumyadip1234"
        // });
    }

    addAnswer(user:string,topic:string,answer:string){
        let url='topic/answer';
        let data={
            "userName": user,
            "topicId": topic,
            "answer": answer
        };
            console.log(user,topic,answer);
            return this.http.postData(url,data);
            // return of({
            //     response:"success"
            // });
    }

    getAllMessages(topic:string){
        let url='topic/answer?topicId='+topic;
        console.log(topic);
        return this.http.getData(url);
    //     return of({response:[
    //         {
    //         message:"soumyadip12345",
    //         time:"11:59",
    //         by:"soumyadc"
    //     },
    //     {
    //         message:"This is a long message This is a long message This is a long message This is a long message This is a long message This is a long message This is a long message",
    //         time:"11:59",
    //         by:"sd"
    //     },
    //     {
    //         message:"This is a long message",
    //         time:"11:59",
    //         by:"sdc"
    //     },
    //     {
    //         message:"This is a long messageThis is a long messageThis is a long messageThis is a long message",
    //         time:"11:59",
    //         by:"soumya"
    //     },
    //     {
    //         message:"soumyadip12345",
    //         time:"11:59",
    //         by:"soudc"
    //     },
    //     {
    //         message:"This is a long message",
    //         time:"11:59",
    //         by:"sd"
    //     },
    //     {
    //         message:"This is a long messageThis is a long messageThis is a long messageThis is a long message",
    //         time:"11:59",
    //         by:"soumya"
    //     },
    //     {
    //         message:"soumyadip12345",
    //         time:"11:59",
    //         by:"sd"
    //     },
    //     {
    //         message:"This is a long message",
    //         time:"11:59",
    //         by:"soumyadc"
    //     },
    // ]})
    }

    unsubFromTopic(usernm,topic:number){

        let url='topic/unsubscribe?userName='+usernm+'&topicId='+topic;
        return this.http.postData(url,{});
        // console.log(usernm,topic);
        // return of({
        //     response:"success"
        // });
    }

    subtoTopic(usernm,topic:number){

        let url='topic/subscribe?userName='+usernm+'&topicId='+topic;
        return this.http.postData(url,{});
        // console.log(usernm,topic);
        // return of({
        //     response:"success"
        // });
    }

    getTopic(topic:number){

        let url='topic?topicId='+topic;
        return this.http.getData(url);
        // console.log(usernm,topic);
        // return of({
        //     response:"success"
        // });
    }

}