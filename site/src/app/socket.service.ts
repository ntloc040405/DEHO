import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:4405/messages';

  constructor(private socket: Socket, private http: HttpClient) {}

  // Join room dựa trên userId
  joinRoom(userId: string) {
    this.socket.emit('join', { userId, role: 'customer' });
  }

  // Lấy lịch sử chat
  getChatHistory(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/history/${userId}`, { headers });
  }

  sendMessage(data: { senderId: string, name: string, avatar: string, message: string }) {
    this.socket.emit('sendMessage', {
      ...data,
      senderRole: 'customer'
    });
  }

  receiveMessage(): Observable<any> {
    return this.socket.fromEvent('receiveMessage');
  }

  disconnect() {
    this.socket.disconnect();
  }
}