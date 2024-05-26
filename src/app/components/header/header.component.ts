import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataStorageService } from 'src/app/services/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  userSub: Subscription;

  constructor(private storageService: DataStorageService, private authService: AuthService) {}
  
  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user; //перетворюємо в булеве значення параметр user (null/{})
    });
  }
  onSaveData() {
    this.storageService.saveRecipes();
  }

  onLoadData() {
    this.storageService.loadRecipes().subscribe()
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
