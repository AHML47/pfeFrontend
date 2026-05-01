import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',  // ← redirige vers /login par défaut
    pathMatch: 'full'
  },
  {
    path: 'login',        // ← page de choix : admin ou client
    loadComponent: () =>
      import('./shared/landing-login/landing-login.component').then(m => m.LandingLoginComponent)
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
    redirectTo: 'login'
  }
];