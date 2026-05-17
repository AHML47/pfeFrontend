import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { NotificationMessage } from '../../user.products';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly auth = inject(AuthService);
  private connection?: HubConnection;

  async connect(token?: string): Promise<void> {
    const accessToken = token ?? this.auth.getToken() ?? '';

    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl('/hubs/notifications', {
          accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();
    }

    if (this.connection.state === 'Connected') return;
    await this.connection.start();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;
    const conn = this.connection;
    this.connection = undefined;
    await conn.stop();
  }

  async joinAdminGroup(): Promise<void> {
    if (!this.connection) return;
    await this.connection.invoke('JoinAdminGroup');
  }

  async leaveAdminGroup(): Promise<void> {
    if (!this.connection) return;
    await this.connection.invoke('LeaveAdminGroup');
  }

  onNotification(handler: (message: NotificationMessage) => void): void {
    this.connection?.on('ReceiveNotification', handler);
  }

  offNotification(handler?: (message: NotificationMessage) => void): void {
    if (!this.connection) return;
    if (handler) {
      this.connection.off('ReceiveNotification', handler);
    } else {
      this.connection.off('ReceiveNotification');
    }
  }
}
