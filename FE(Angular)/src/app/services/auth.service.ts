import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // Backend URL

  constructor(private http: HttpClient) {}

  login() {
    window.location.href = 'http://localhost:3000/auth/github';
  }

  loginWithGithub(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/github`);
  }

  checkAuthStatus(userId:String): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/status`,{id:userId});
  }
  removeGithubConnection(userId:String): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/remove`, {id:userId}); 
  }

  getOrganizations(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/organizations?userId=${userId}`);
  }

  getRepos(organizationId: string, userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repos?organizationId=${organizationId}&userId=${userId}`);
  }

  getRepoDetails(repoId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/repo-details?repoId=${repoId}&userId=${userId}`);
  }
}
