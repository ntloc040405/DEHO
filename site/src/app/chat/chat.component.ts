import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatService } from '../socket.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isChatOpen = false;
  messages: any[] = [];
  newMessage = '';
  currentUser: any = null;

  private sub!: Subscription;

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Xóa triệt để guestId khỏi bộ nhớ
    localStorage.removeItem('guestId');

    // Subscribe vào luồng thông tin người dùng
    this.sub = this.userService.user$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        // Chỉ khi có user thực sự mới join room và load lịch sử
        this.chatService.joinRoom(user._id);
        this.loadHistory(user._id);
      } else {
        this.messages = [];
      }
    });

    // Lắng nghe tin nhắn mới từ socket
    this.chatService.receiveMessage().subscribe((data) => {
      if (data) {
        this.messages.push(data);
        this.scrollToBottom();
      }
    });
  }

  private refreshUser() {
    this.currentUser = this.userService.getCurrentUser();
  }

  loadHistory(userId: string) {
    if (!userId) return;
    
    this.chatService.getChatHistory(userId).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.messages = res.data || [];
          this.scrollToBottom();
        }
      },
      error: (err) => console.log('Chat history load skipped')
    });
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text) return;

    this.refreshUser();
    if (!this.currentUser) return; // Bảo vệ: Phải đăng nhập mới gửi được

    const senderId = this.currentUser._id;
    const name = this.currentUser.name;
    const avatar = this.currentUser.avatar;

    const msgData = {
      senderId,
      name,
      avatar,
      message: text
    };

    try {
      this.chatService.sendMessage(msgData);

      this.messages.push({
        senderId,
        senderRole: 'customer',
        message: text,
        timestamp: new Date()
      });

      this.newMessage = '';
      this.scrollToBottom();
    } catch (err) {
      console.error('Socket error:', err);
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.refreshUser();
      if (this.currentUser) {
        this.loadHistory(this.currentUser._id);
      }
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.myScrollContainer) {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
      } catch(err) { }
    }, 100);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    this.chatService.disconnect();
  }
}