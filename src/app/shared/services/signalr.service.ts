import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: signalR.HubConnection;

  // ================= START CONNECTION =================
  startConnection(): void {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5045/hubs/notifications') // ✔ FIX ICI
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected');
      })
      .catch((err: any) => {
        console.log('❌ SignalR Error', err);
      });
  }

  // ================= JOIN ADMIN GROUP =================
  // joinAdminGroup(): void {

  //   if (!this.hubConnection) {
  //     console.warn('⚠️ SignalR not initialized');
  //     return;
  //   }
  //   if(this.hubConnection.state === signalR.HubConnectionState.Connected) {
  //   this.hubConnection.invoke('JoinAdminGroup')
  //     .then(() => console.log('✅ Joined Admin Group'))
  //     .catch((err: any) => console.log('❌ JoinGroup Error', err));
  //   }
  //   else{
  //     console.log('⚠️ SignalR not connected yet, cannot join group');
  //   }
  // }

  // ================= LISTEN NOTIFICATIONS =================
  onNotification(callback: (message: string) => void): void {

    this.hubConnection.on('ReceiveNotification', (message: string,type:string,createdAt: Date) => {
      callback(message);
    });
  }
}