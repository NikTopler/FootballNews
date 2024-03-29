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

import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { EmailComponent } from './components/settings/admin/email/email.component';
import { CustomEmailsComponent } from './components/settings/admin/insight/custom-emails/custom-emails.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './pages/search/search.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { StatsComponent } from './pages/leagues/stats/stats.component';
import { NewsComponent } from './pages/leagues/news/news.component';
import { PlayersComponent } from './pages/leagues/players/players.component';
import { StandingsComponent } from './pages/leagues/standings/standings.component';
import { MatchesComponent } from './pages/leagues/matches/matches.component';


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
    DownloadComponent,
    EditorComponent,
    EmailComponent,
    CustomEmailsComponent,
    FooterComponent,
    SearchComponent,
    LeaguesComponent,
    StatsComponent,
    NewsComponent,
    PlayersComponent,
    StandingsComponent,
    MatchesComponent
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
