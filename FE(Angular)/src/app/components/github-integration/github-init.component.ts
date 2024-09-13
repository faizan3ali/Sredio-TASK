import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './interface';

@Component({
  selector: 'app-github-init',
  templateUrl: './github-init.component.html',
  styleUrls: ['./github-init.component.scss']
})
export class GitHubInitComponent implements OnInit {
  isAuthenticated = false;
  userData: User | null = null;
  username: string | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.authService.checkAuthStatus(userId).subscribe(
          (response) => {
            this.isAuthenticated = response.isAuthenticated;
            this.userData = response.user;
          },
          (error) => {
            console.error('Error checking auth status:', error);
            this.isAuthenticated = false;
          }
        );
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  login() {
    this.authService.login();
  }

  removeGithub() {
    if (this.userData && this.userData.id) {
      this.authService.removeGithubConnection(this.userData.id).subscribe(
        (response) => {
          console.log('Successfully removed GitHub connection:', response);
          this.isAuthenticated = false; 
        },
        (error) => {
          console.error('Failed to remove GitHub connection:', error);
        }
      );
    } else {
      console.error('User data or user ID not available.');
    }
  }
}
