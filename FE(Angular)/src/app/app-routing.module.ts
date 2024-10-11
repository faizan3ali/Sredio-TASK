import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GitHubInitComponent } from './components/github-integration/github-init.component';


const routes: Routes = [
  { path: '', component: GitHubInitComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
