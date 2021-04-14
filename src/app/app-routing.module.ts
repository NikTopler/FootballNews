import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AccountComponent } from './components/settings/account/account.component';
import { UserGuard } from './guards/user/user.guard';
import { EmailComponent } from './components/settings/email/email.component';
import { ThemeComponent } from './components/settings/theme/theme.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { ImportComponent } from './components/settings/admin/import/import.component';
import { AdminPanelComponent } from './components/settings/admin/admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [UserGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'account'},
    { path: 'account', component: AccountComponent },
    { path: 'notification', component: EmailComponent },
    { path: 'theme', component: ThemeComponent },
    { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
    { path: 'admin/import', component: ImportComponent, canActivate: [AdminGuard] }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
