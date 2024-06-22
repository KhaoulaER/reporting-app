import { Component, OnInit } from '@angular/core';
import { Role, User } from '../user/model/user';
import { UserService } from '../user/user.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent{

  
  selectedRole: string | null = null;
  roles = Object.keys(Role);
  users!: User[];

  sidebarVisible: boolean = false;
  constructor(private userService: UserService){}
  /*selectRole(role: string): void {
    this.selectedRole = role;
    this.userService.getUsersByRole(role).subscribe(users => {
      this.users = users;
    });
  }*/

}
