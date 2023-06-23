import { Component, OnInit } from '@angular/core';
import { NavComponent, NavItem } from '../../nav/nav.component';

export interface DashboardNavItem extends NavItem {
  listLabel: string;
  listIcon: string;
  newLabel: string;
  newIcon: string;
  newRoute: string;
}

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends NavComponent implements OnInit {
  private readonly listLabel = 'View list';
  private readonly listIcon = 'list';
  private readonly newLabel = 'Add new';
  private readonly newIcon = 'add';
  private readonly newRoute = 'new';
  private readonly settingsRoute = 'settings';
  private readonly navsRoute = 'navigations';
  private readonly stylesRoute = 'styles';
  private readonly scriptsRoute = 'scripts';

  constructor() {
    super(...NavComponent.deps());
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  get publicItems(): DashboardNavItem[] {
    const navItems = this.items
      .slice(1)
      .filter((item) => item.isAdmin !== true);

    return navItems.map((item) => this.mapNavItemToDashboardNavItem(item));
  }

  get adminItems(): DashboardNavItem[] {
    const filterNavItems = this.items.filter(
      (item) => item.isAdmin === true && item.route !== this.settingsRoute,
    );

    return [
      ...filterNavItems.map((item) => this.mapNavItemToDashboardNavItem(item)),
      ...this.settingsItems,
    ];
  }

  private get settingsItems(): DashboardNavItem[] {
    const settingsNavItem = this.items.find(
      (item) => item.route === this.settingsRoute,
    );

    return [
      this.mapNavItemToDashboardNavItem({
        label: 'Navigations',
        route: `${this.settingsRoute}/${this.navsRoute}`,
        icon: settingsNavItem!.icon as string,
        isAdmin: true,
        refId: 'navigations',
      }),
      this.mapNavItemToDashboardNavItem({
        label: 'Styles',
        route: `${this.settingsRoute}/${this.stylesRoute}`,
        icon: settingsNavItem!.icon as string,
        isAdmin: true,
        refId: 'styles',
      }),
      this.mapNavItemToDashboardNavItem({
        label: 'Scripts',
        route: `${this.settingsRoute}/${this.scriptsRoute}`,
        icon: settingsNavItem!.icon as string,
        isAdmin: true,
        refId: 'scripts',
      }),
    ];
  }

  private mapNavItemToDashboardNavItem(navItem: NavItem): DashboardNavItem {
    return {
      ...navItem,
      listLabel: this.listLabel,
      listIcon: this.listIcon,
      newLabel: this.newLabel,
      newIcon: this.newIcon,
      newRoute: `${navItem.route}/${this.newRoute}`,
    };
  }
}
