import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AnswerFormComponent } from "./AnswerForm/AnswerForm.component";
import { ChatWindowComponent } from "./ChatWindow/ChatWindow.component";
import { LoginRegisterComponent } from "./LoginRegister/LoginRegister.component";
import { QuestionFormComponent } from "./QuestionForm/QuestionForm.component";
import { WelcomeComponent } from "./Welcome/Welcome.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { HttpService } from "./Services/http.service";
import { AuthorizeRegisterService } from "./Services/authorize-register.service";
import { HomePageComponent } from "./homePage/homePage.component";
import { MessagesComponent } from "./Messages/Messages.component";
import { ProfileComponent } from "./Profile/Profile.component";
import { QuestionStateService } from "./Services/question.state.service";
import { MessageService } from "./Services/messages.service";
import { RouteReuseStrategy } from "@angular/router";
import { CacheRouteReuseStrategy } from "./Services/route-reuse.strategy";
import { MsgCountStateService } from "./Services/message.count.state.service";


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        AnswerFormComponent,
        ChatWindowComponent,
        LoginRegisterComponent,
        QuestionFormComponent,
        WelcomeComponent,
        HomePageComponent,
        MessagesComponent,
        ProfileComponent
       
    ],
    providers: [
        HttpService,
        AuthorizeRegisterService,
        QuestionStateService,
        MessageService,
        MsgCountStateService
        // {provide: RouteReuseStrategy,
        // useClass: CacheRouteReuseStrategy
        // }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
