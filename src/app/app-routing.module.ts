import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountComponent } from './components/settings/account/account.component';
import { UserGuard } from './guards/user/user.guard';
import { NotificationComponent } from './components/settings/notification/notification.component';
import { ThemeComponent } from './components/settings/theme/theme.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { ImportComponent } from './components/settings/admin/import/import.component';
import { AdminPanelComponent } from './components/settings/admin/admin-panel/admin-panel.component';
import { DisplayComponent } from './components/settings/admin/display/display.component';
import { ImportsComponent } from './components/settings/admin/insight/imports/imports.component';
import { EmailComponent } from './components/settings/admin/email/email.component';
import { CustomEmailsComponent } from './components/settings/admin/insight/custom-emails/custom-emails.component';
import { SearchComponent } from './pages/search/search.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'leagues/:league/:type', component: LeaguesComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [UserGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'account'},
    { path: 'account', component: AccountComponent },
    { path: 'notification', component: NotificationComponent },
    { path: 'theme', component: ThemeComponent },
    { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
    { path: 'admin/import', component: ImportComponent, canActivate: [AdminGuard] },
    { path: 'admin/display', component: DisplayComponent, canActivate: [AdminGuard] },
    { path: 'admin/email', component: EmailComponent, canActivate: [AdminGuard] },
    { path: 'admin/insight/imports', component: ImportsComponent, canActivate: [AdminGuard] },
    { path: 'admin/insight/emails', component: CustomEmailsComponent, canActivate: [AdminGuard] },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
