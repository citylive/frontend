import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable(
    {
       providedIn: "root"
    }
)
export class HttpService {
    private serverUrl = " https://citylive-server-qa.herokuapp.com/cityLive/";

    constructor(private http: HttpClient) { }

    getData(uri) {
        let url=this.serverUrl+uri;
        let headers = this.createRequestHeader();
        return this.http.get(url, { headers: headers });
    }

    postData(uri,payload){
        let url=this.serverUrl+uri;
        let headers = this.createRequestHeader();
        return this.http.post(url,payload, { headers: headers });
    }

    putData(uri,payload){
        let url=this.serverUrl+uri;
        let headers = this.createRequestHeader();
        return this.http.put(url,payload, { headers: headers });
    }

    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
         });

        return headers;
    }

    getLocationName(lat:number,long:number){
        let url='https://geocode.xyz/'+lat+','+long+'?geoit=json';
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
         });
        return this.http.get(url, { headers: headers });
    }
}