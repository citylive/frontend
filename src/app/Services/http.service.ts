import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable(
    {
       providedIn: "root"
    }
)
export class HttpService {
    private serverUrl = "https://citylife.free.beeceptor.com";

    constructor(private http: HttpClient) { }

    getData(url) {
        let headers = this.createRequestHeader();
        return this.http.get(url, { headers: headers });
    }

    postData(payload){
        let headers = this.createRequestHeader();
        return this.http.post(this.serverUrl,payload, { headers: headers });
    }

    private createRequestHeader() {
        // set headers here e.g.
        let headers = new HttpHeaders({
            "Content-Type": "application/json",
         });

        return headers;
    }
}