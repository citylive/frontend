import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { WelcomeComponent } from "./Welcome/Welcome.component";
import { LauncherComponent } from "./Launcher/Launcher.component";
import { AnswerFormComponent } from "./AnswerForm/AnswerForm.component";
import { ChatWindowComponent } from "./ChatWindow/ChatWindow.component";
import { LoginRegisterComponent } from "./LoginRegister/LoginRegister.component";
import { QuestionFormComponent } from "./QuestionForm/QuestionForm.component";


const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "welcome", component: WelcomeComponent },
    { path: "answer", component: AnswerFormComponent },
    { path: "chat", component: ChatWindowComponent },
    { path: "login", component: LoginRegisterComponent },
    { path: "ask", component: QuestionFormComponent },
    { path: "launcher", component: LauncherComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
