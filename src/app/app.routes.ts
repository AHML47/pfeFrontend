import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user-routing/user-routing-module').then(m => m.UserRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
 
  {
    path: '**',
    redirectTo: 'user'
  }
];