import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:4405/messages';

  constructor(private http: HttpClient) {
    // Khởi tạo socket trực tiếp từ socket.io-client để tránh lỗi DI của Angular
    this.socket = io('http://localhost:4405', {
      transports: ['websocket']
    });
  }

  // Lấy token từ localStorage
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Kết nối với vai trò 'admin'
  joinAsAdmin() {
    this.socket.emit('join', { userId: '67e32d8b2157440b136ea729', role: 'admin' });
  }

  // Lấy danh sách cuộc hội thoại
  getConversations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversations`, { headers: this.getHeaders() });
  }

  // Lấy lịch sử chat với 1 user
  getChatHistory(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${userId}`, { headers: this.getHeaders() });
  }

  // Nhận tin nhắn thực tế qua socket
  receiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Gửi tin nhắn đến khách hàng cụ thể
  replyMessage(receiverId: string, message: string) {
    this.socket.emit('replyMessage', {
      receiverId,
      message
    });
  }

  // Ngắt kết nối
  disconnect() {
    this.socket.disconnect();
  }
}
