import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommunityComponent } from './community/community.component';


export const routes: Routes = [
    {path:"", component:MainComponent},
    {path:"login", component:LoginComponent},
    {path:"register", component:RegisterComponent},
    {path:"community", component:CommunityComponent}
];
