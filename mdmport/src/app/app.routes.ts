import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommunityComponent } from './community/community.component';
import { CartComponent } from './cart/cart.component';
import { LibraryComponent } from './library/library.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {path:"", component:MainComponent},
    {path:"login", component:LoginComponent},
    {path:"register", component:RegisterComponent},
    {path:"community", component:CommunityComponent},
    {path:"cart", component:CartComponent},
    {path:"library", component:LibraryComponent},  
    {path: 'settings',component: SettingsComponent},
];
