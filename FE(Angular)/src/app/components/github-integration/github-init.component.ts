import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-github-init',
  templateUrl: './github-init.component.html',
  styleUrls: ['./github-init.component.scss'],
})
export class GitHubInitComponent implements OnInit {
  isAuthenticated = false;
  userData: any = null;
  organizations: any[] = [];
  repos: any[] = [];
  loading = false;
  userStats: any[] = [];
  columnDefs = [
    { headerName: 'ID', field: 'githubId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Link', field: 'html_url', cellRenderer: this.linkRenderer },
    { headerName: 'Slug', field: 'fullName' },
    { headerName: 'Included', checkboxSelection: true },
  ];

  rowData = [];
  private gridApi!: GridApi;  // Capture GridApi

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.authService.checkAuthStatus(userId).subscribe(
          (response) => {
            this.isAuthenticated = response.isAuthenticated;
            this.userData = response.user;
            if (this.isAuthenticated) {
              this.loadOrganizations();
            }
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

  // Capture the Grid API on gridReady event
  onGridReady(params: any) {
    this.gridApi = params.api;  // Store GridApi
  }

  loadOrganizations() {
    this.loading = true;
    this.http
      .get<any[]>(
        `http://localhost:3000/github/organizations?userId=${this.userData?.id}`
      )
      .subscribe(
        (organizations) => {
          this.organizations = organizations;
          this.loadRepos();
        },
        (error) => {
          console.error('Error fetching organizations:', error);
        }
      );
  }

  loadRepos() {
    this.organizations.forEach((org) => {
      this.http
        .get<any[]>(
          `http://localhost:3000/github/repos?organizationId=${org._id}&userId=${this.userData?.id}`
        )
        .subscribe(
          (repos) => {
            repos.forEach((repo) => {
              repo.organization = org.login;
              repo.included = false;
            });
            this.repos.push(...repos);
            this.rowData = [...this.repos];
            this.loading = false;
          },
          (error) => {
            console.error('Error fetching repos:', error);
            this.loading = false;
          }
        );
    });
  }

  // Triggered when a row is selected
  onCellValueChanged(event: any) {
    const selectedNodes = this.gridApi.getSelectedNodes();  // Get selected nodes
    const selectedRepos = selectedNodes.map((node) => node.data.githubId);  // Extract repo IDs

    if (selectedRepos.length > 0) {
      this.fetchRepoDetailsBatch(selectedRepos);  // Send batch of repo IDs to fetch their details
    }
  }

  // Fetch details for all selected repositories
  fetchRepoDetailsBatch(selectedRepoIds: string[]) {
    this.loading = true;
    this.http
      .post<any>('http://localhost:3000/github/repo-details-batch', {
        repoIds: selectedRepoIds,
        userId: this.userData?.id,
      })
      .subscribe(
        (data) => {
          console.log('Batch repo data:', data);
          this.userStats = data
        
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching batch repo details:', error);
          this.loading = false;
        }
      );
  }

  removeGithub() {
    if (this.userData && this.userData.id) {
      this.authService.removeGithubConnection(this.userData.id).subscribe(
        (response) => {
          console.log('Successfully removed GitHub connection:', response);
          this.isAuthenticated = false;
          this.repos = [];
          this.rowData = [];
        },
        (error) => {
          console.error('Failed to remove GitHub connection:', error);
        }
      );
    } else {
      console.error('User data or user ID not available.');
    }
  }

  login() {
    this.authService.login();
  }

  linkRenderer(params: any) {
    console.log(params);
    let url = 'https://github.com/' + params.data.fullName;
    return `<a href="${url}" target="_blank">${params.data.name}</a>`;
  }
}
