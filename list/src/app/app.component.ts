import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'list';
  public tasks: any = [];
  public newTask;
  public counter;

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.getTasks();
    this.getUsersCounter();
  }

  sendTask() {
    let task = { id: nanoid(), description: this.newTask };
    this.socket.emit('sharedList', task);
    this.newTask = '';
  }

  getTasks() {
    this.socket.fromEvent('sharedList').subscribe((data) => {
      this.tasks = data;
    });
  }

  deleteTask(id) {
    this.socket.emit('deleteTask', id);
  }

  getUsersCounter() {
    this.socket.fromEvent('counter').subscribe((info) => {
      if (info == 1) {
        this.counter = 'Hay 1 persona conectada actualmente';
      } else {
        this.counter = `Hay ${info} personas conectadas actualmente`;
      }
    });
  }
}
