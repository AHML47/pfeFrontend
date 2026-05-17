import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DashboardAlert, DashboardAlertApi, DashboardStats, DashboardStatsApi } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStatsApi>('http://localhost:5045/api/dashboard/stats').pipe(
      map((stats) => ({
        revenue: stats.ChiffreAffairesMois,
        totalOrders: stats.TotalCommandes,
        activeUsers: stats.TotalProduits
      }))
    );
  }

  getAlerts(): Observable<DashboardAlert[]> {
    return this.http.get<DashboardAlertApi[]>('/api/dashboard/alertes').pipe(
      map((alerts) =>
        alerts.map((alert) => ({
          message: `${alert.Produit} (${alert.Stock})`,
          produit: alert.Produit,
          stock: alert.Stock,
          type: alert.EstCritique ? 'critical' : 'normal'
        }))
      )
    );
  }
}
