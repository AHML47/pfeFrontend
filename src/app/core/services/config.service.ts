import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);

  getConfig(): Observable<Config> {
    return this.http.get<Config>('/api/config');
  }

  updateConfig(config: Config): Observable<void> {
    return this.http.put<void>('/api/config', config);
  }
}
