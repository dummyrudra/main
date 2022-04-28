import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket, private auth: AuthService) {
    if (auth.isLoggedIn()) {
      let currentUser: any = this.auth.getLoggedInUser();
      if (currentUser?._id) this.joinRoom(currentUser?._id);
    }
  }
  // emit event
  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  // listen event
  OnFriendRequest() {
    return this.socket.fromEvent('friendRequest');
  }
  OnCancelRequest() {
    return this.socket.fromEvent('cancelRequest');
  }
  OnReceiveMessage() {
    return this.socket.fromEvent('receiveMessage');
  }
}
