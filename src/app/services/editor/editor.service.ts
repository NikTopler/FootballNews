import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  activeArray: string[] = [];

  userTemplate: string[] = ['firstName','lastName','email','admin','createdAt','updatedAt','profileImage','googleID','facebookID','amazonID','safeImport','editImport'];
  teamTemplate: string[] = ['name', 'teamID', 'shortCode', 'logo', 'country', 'continent', 'league', 'seasonStartDate', 'seasonEndDate'];
  leagueTemplate: string[] = ['name'];
  countryTemplate: string[] = ['name', 'code', 'continent'];

}
