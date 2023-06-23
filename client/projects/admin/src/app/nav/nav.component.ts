import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminAuthUser } from '../auth/admin-auth.interface';
import { AdminAuthRepository } from '../auth/admin-auth.repository';

export type NavComponentDeps = [AdminAuthRepository];

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  refId: string;
  isAdmin?: boolean;
}

@Component({ template: '' })
export abstract class NavComponent implements OnInit, OnDestroy {
  static deps(): NavComponentDeps {
    return [inject(AdminAuthRepository)];
  }

  userName!: string;
  isAdmin!: boolean;
  userResolved = false;
  private authRepoSubscription!: Subscription;

  constructor(private authRepo: AdminAuthRepository) {
    this.setUser(null);
  }

  ngOnInit() {
    this.authRepoSubscription = this.authRepo.user$.subscribe(
      this.setUser.bind(this),
    );
  }

  ngOnDestroy() {
    this.authRepoSubscription.unsubscribe();
  }

  // this is required when using routerLinkActive
  // https://github.com/angular/angular/issues/47050
  trackItemsBy(_: any, item: NavItem) {
    return item.refId;
  }

  get items(): NavItem[] {
    return this.userResolved
      ? [
          {
            label: 'Dashboard',
            route: 'dashboard',
            icon: 'dashboard',
            refId: 'dashboard',
          },
          {
            label: 'Pages',
            route: 'pages',
            icon: 'web',
            refId: 'pages',
          },
          {
            label: 'Articles',
            route: 'articles',
            icon: 'article',
            refId: 'articles',
          },
          {
            label: 'Blocks',
            route: 'blocks',
            icon: 'short_text',
            refId: 'blocks',
          },
          {
            label: 'Code Blocks',
            route: 'code-blocks',
            icon: 'code_blocks',
            refId: 'codeBlocks',
          },
          {
            label: 'Multimedia',
            route: 'multimedia',
            icon: 'perm_media',
            refId: 'media',
          },
          ...this.itemsAdmin,
        ]
      : [];
  }

  private setUser(user: AdminAuthUser) {
    if (user == null) {
      this.userName = '';
      this.isAdmin = false;
      return;
    }
    this.userResolved = true;
    this.userName = user.username;
    this.isAdmin = user.isAdmin === true;
  }

  private get itemsAdmin(): NavItem[] {
    return this.isAdmin
      ? [
          {
            label: 'Users',
            route: 'users',
            icon: 'group',
            isAdmin: true,
            refId: 'users',
          },
          {
            label: 'Settings',
            route: 'settings',
            icon: 'settings',
            isAdmin: true,
            refId: 'settings',
          },
        ]
      : [];
  }
}
