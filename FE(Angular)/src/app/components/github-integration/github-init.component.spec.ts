import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitHubInitComponent } from './github-init.component';

describe('GitHubInitComponent', () => {
  let component: GitHubInitComponent;
  let fixture: ComponentFixture<GitHubInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GitHubInitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitHubInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
