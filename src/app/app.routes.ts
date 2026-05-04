import { Routes } from '@angular/router';

export const routes: Routes = [

  // ✅ default → USER HOME
  {
    path: '',
    redirectTo: 'user/home',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./shared/landing-login/landing-login.component')
        .then(m => m.LandingLoginComponent)
  },

  {
    path: 'user',
    loadChildren: () =>
      import('./user/user-routing/user-routing-module')
        .then(m => m.UserRoutingModule)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-routing.module')
        .then(m => m.AdminRoutingModule)
  },

  // ⭐ CONFIRM EMAIL (CORRECT)
  {
    path: 'confirm-email',
    loadComponent: () =>
      import('./shared/confirm-email/confirm-email.component')
        .then(m => m.ConfirmEmailComponent)
  },

  {
    path: '**',
    redirectTo: 'user/home'
  }
];