import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

import { AdminReclamationsComponent } from './dashboard/sections/reclamations/admin-reclamations.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'deliveries', 
    loadComponent: () =>
      import('./dashboard/sections/deliveries/deliveries.component').then(m => m.AdminDeliveriesComponent)
  },
 
{ path: 'reclamations', component: AdminReclamationsComponent },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
