import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LauncherComponent } from "./Launcher/Launcher.component";
import { AnswerFormComponent } from "./AnswerForm/AnswerForm.component";
import { ChatWindowComponent } from "./ChatWindow/ChatWindow.component";
import { LoginRegisterComponent } from "./LoginRegister/LoginRegister.component";
import { QuestionFormComponent } from "./QuestionForm/QuestionForm.component";
import { WelcomeComponent } from "./Welcome/Welcome.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";


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
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        LauncherComponent,
        AnswerFormComponent,
        ChatWindowComponent,
        LoginRegisterComponent,
        QuestionFormComponent,
        WelcomeComponent
       
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
