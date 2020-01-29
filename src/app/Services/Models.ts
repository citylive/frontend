export interface User{
    username:string,
    email:string,
    password:string,
    firstname?:string,
    lastname?:string
}

export interface Question{
    askedby:string,
    question:string,
    closed:boolean,
    latitude:number,
    longitude:number
}