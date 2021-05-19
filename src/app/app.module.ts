import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SigninComponent } from './pages/authentication/signin/signin.component';
import { SignupComponent } from './pages/authentication/signup/signup.component';
import { ExternalComponent } from './pages/authentication/external/external.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountComponent } from './components/settings/account/account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationComponent } from './components/settings/notification/notification.component';
import { ThemeComponent } from './components/settings/theme/theme.component';
import { ImportComponent } from './components/settings/admin/import/import.component';
import { AdminPanelComponent } from './components/settings/admin/admin-panel/admin-panel.component';
import { DisplayComponent } from './components/settings/admin/display/display.component';
import { ImportsComponent } from './components/settings/admin/insight/imports/imports.component';
import { DownloadComponent } from './components/download/download.component';
import { EditorComponent } from './components/editor/editor.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClipboardModule } from '@angular/cdk/clipboard'

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';

import { ChartsModule } from 'ng2-charts';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LaligaComponent } from './pages/laliga/laliga.component';

import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { LaligaNewsComponent } from './pages/laliga-news/laliga-news.component';
import { LaligaStandingsComponent } from './pages/laliga-standings/laliga-standings.component';
import { PremiereLeagueComponent } from './pages/premiere-league/premiere-league.component';
import { PremiereLeagueNewsComponent } from './pages/premiere-league-news/premiere-league-news.component';
import { PremiereLeagueStandingsComponent } from './pages/premiere-league-standings/premiere-league-standings.component';
import { EmailComponent } from './components/settings/admin/email/email.component';
import { CustomEmailsComponent } from './components/settings/admin/insight/custom-emails/custom-emails.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    ExternalComponent,
    NavbarComponent,
    AccountComponent,
    SettingsComponent,
    NotificationComponent,
    ThemeComponent,
    ImportComponent,
    AdminPanelComponent,
    DisplayComponent,
    ImportsComponent,
    NavBarComponent,
    LaligaComponent,
    LaligaNewsComponent,
    LaligaStandingsComponent,
    PremiereLeagueComponent,
    PremiereLeagueNewsComponent,
    PremiereLeagueStandingsComponent,
    DownloadComponent,
    EditorComponent,
    EmailComponent,
    CustomEmailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    SocialLoginModule,
    MatButtonModule,
    ChartsModule
  ],
  providers: [{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleLoginProvider
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebookLoginProvider
            )
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              environment.amazonLoginProvider
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    AppComponent,
    DownloadComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
