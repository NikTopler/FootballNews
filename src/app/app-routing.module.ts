import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountComponent } from './components/settings/account/account.component';
import { UserGuard } from './guards/user/user.guard';
import { UpdateComponent } from './components/settings/update/update.component';
import { EmailComponent } from './components/settings/email/email.component';
import { ThemeComponent } from './components/settings/theme/theme.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [UserGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'account'},
    { path: 'account', component: AccountComponent },
    { path: 'update', component: UpdateComponent },
    { path: 'email', component: EmailComponent },
    { path: 'theme', component: ThemeComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
