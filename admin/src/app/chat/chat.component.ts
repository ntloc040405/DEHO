import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule], 
})
export class ChatComponent implements OnInit, OnDestroy {
  conversations: any[] = [];
  activeUser: any = null;
  messages: any[] = [];
  newMessage = '';
  searchQuery = '';

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.chatService.joinAsAdmin();
    this.loadConversations();
    
    // Đăng ký nhận tin nhắn realtime
    this.chatService.receiveMessage().subscribe((data) => {
      if (!data) return;

      // Nếu tin nhắn thuộc về user đang active, thêm vào list messages
      if (this.activeUser && (data.senderId == this.activeUser._id || data.receiverId == this.activeUser._id)) {
        this.messages.push(data);
        this.scrollToBottom();
      }
      
      // Luôn cập nhật lại danh sách hội thoại để hiển thị tin nhắn mới nhất
      this.loadConversations();
    });
  }

  loadConversations() {
    this.chatService.getConversations().subscribe((res) => {
      if (res.success) {
        this.conversations = res.data;
      }
    });
  }

  selectUser(conv: any) {
    this.activeUser = {
      _id: conv._id,
      name: conv.name || 'Khách hàng',
      avatar: conv.avatar || '/images/avt.png'
    };
    this.loadChatHistory(conv._id);
  }

  loadChatHistory(userId: string) {
    this.chatService.getChatHistory(userId).subscribe((res) => {
      if (res.success) {
        this.messages = res.data;
        this.scrollToBottom();
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.activeUser) {
      this.chatService.replyMessage(this.activeUser._id, this.newMessage);
      
      const myMsg = {
        senderId: '67e32d8b2157440b136ea729',
        receiverId: this.activeUser._id,
        senderRole: 'admin',
        name: 'Admin',
        message: this.newMessage,
        timestamp: new Date()
      };
      
      this.messages.push(myMsg);
      this.newMessage = '';
      this.scrollToBottom();
      
      // Cập nhật lại list hội thoại
      this.loadConversations();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 100);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
