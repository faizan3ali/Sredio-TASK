import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { GridApi } from 'ag-grid-community';
@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnChanges  {
  @Input() userData: any = [];
  private gridApi!: GridApi;
 
  constructor(private cdr: ChangeDetectorRef) {}
  columnDefs = [
    { headerName: 'User', field: 'user' },
    { headerName: 'UserId', field: 'userId' },
    { headerName: 'Total Commits', field: 'totalCommits' },
    { headerName: 'Total Pull Requests', field: 'totalPullRequests' },
    { headerName: 'Total Issues', field: 'totalIssues' }
  ];
  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges triggered with changes: ", changes);
    if (changes['userData'] && changes['userData'].currentValue !== changes['userData'].previousValue) {
      if (this.gridApi) {
        this.gridApi.setRowData(this.userData);
      }
      this.cdr.detectChanges();
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    console.log("Grid is ready with initial userData:", this.userData);

    if (this.userData.length > 0) {
      this.gridApi.setRowData(this.userData); 
    }
  }
}
