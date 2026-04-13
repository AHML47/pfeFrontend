import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AdminLoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AdminLoginComponent,
    AdminDashboardComponent
  ],
  exports: [
    AdminLoginComponent,
    AdminDashboardComponent
  ]
})
export class AdminModule { }
