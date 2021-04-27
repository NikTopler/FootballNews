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
import { EmailComponent } from './components/settings/email/email.component';
import { ThemeComponent } from './components/settings/theme/theme.component';
import { ImportComponent } from './components/settings/admin/import/import.component';
import { AdminPanelComponent } from './components/settings/admin/admin-panel/admin-panel.component';
import { DisplayComponent } from './components/settings/admin/display/display.component';
import { ImportsComponent } from './components/settings/admin/insight/imports/imports.component';
import { DownloadComponent } from './components/download/download.component';
import { EditorComponent } from './components/editor/editor.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';

import { ChartsModule } from 'ng2-charts';
import { BootstrapComponent } from './components/bootstrap/bootstrap.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LaligaComponent } from './pages/laliga/laliga.component';

import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { LaligaNewsComponent } from './pages/laliga-news/laliga-news.component';
import { LaligaStandingsComponent } from './pages/laliga-standings/laliga-standings.component';
import { PremiereLeagueComponent } from './pages/premiere-league/premiere-league.component';
import { PremiereLeagueNewsComponent } from './pages/premiere-league-news/premiere-league-news.component';
import { PremiereLeagueStandingsComponent } from './pages/premiere-league-standings/premiere-league-standings.component';


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
    EmailComponent,
    ThemeComponent,
    ImportComponent,
    AdminPanelComponent,
    DisplayComponent,
    ImportsComponent,
    BootstrapComponent,
    NavBarComponent,
    LaligaComponent,
    LaligaNewsComponent,
    LaligaStandingsComponent,
    PremiereLeagueComponent,
    PremiereLeagueNewsComponent,
    PremiereLeagueStandingsComponent,
    DownloadComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
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
