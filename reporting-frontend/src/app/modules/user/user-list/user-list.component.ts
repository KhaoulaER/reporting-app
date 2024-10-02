import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, MenuItemDef,} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users: User[]=[];
  errorMessage!: string;
  //for edit modal
  position: string = 'center';
  selectedUser : any = null;
  visible: boolean = false;
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  
   
  constructor(private route: ActivatedRoute, private userService: UserService, private fb:FormBuilder, private messageService:MessageService, private confirmationService:ConfirmationService){}
  //Initialisation de l'observale paramMap contient les routes
  ngOnInit(): void {
    this.loadUsers();
  }

  handleEditUser(user:User, position:string){
    this.visible=true;
    this.position=position;
    this.selectedUser = user;
    this.id = user.id;
    this.firstName=user.firstName;
    this.lastName=user.lastName;
    this.email=user.email;
    this.phone=user.phone;
  }

  handleSubmit(){

  }
  ////////for modal
  onCancel(isClosed: boolean) {
    this.visible = !isClosed;
  }

  loadUsers(): void {
    this.route.paramMap.subscribe(params => {
      const role = params.get('role');
      if (role) {
        this.userService.findAllByRole(role).subscribe({
          next: (data) => {
            this.users = data;
          },
          error: (err) => {
            this.errorMessage = `Failed to load users: ${err.message}`;
          }
        });
      }
    });
  }

  onSave(newData: any) {
    if(newData.id === this.selectedUser.id){
      const user = this.users.findIndex(data => data.id === newData.id);
      this.users[user]=newData; 
      
    }else{
    this.users.unshift(newData)
    }
    this.loadUsers();
  }

  handleDeleteUser(user:User){
    this.confirmationService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.userService.deleteUser(user.id).subscribe(
          response => {
            this.users = this.users.filter(data => data.id !== user.id);
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          }
        )
      }
  });
  }

 
}
