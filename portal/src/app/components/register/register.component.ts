import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
 
@Component({
    selector: "register",
    templateUrl: './register.component.html',
     providers: [UserService]
})
export class RegisterComponent implements OnInit{
    public title:string;
    public registerUser: User;

    public registerStatus: string;
    public identity;
    public token;


    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserServices: UserService
    ){
        this.title = 'Registrate';
        this.registerStatus = 'none';
        this.registerUser = new User('','','','','','','ROLE_USER','');
        
    }

    ngOnInit(){
        console.log('Register component is load...');
    }

    registerSubmit(registerForm){
         this.myUserServices.register(this.registerUser).subscribe(
             response => {
                 if(response.user && response.user._id){
                     this.registerStatus = 'success';
                     registerForm.reset();
                 }else{
                     this.registerStatus = 'error';
                 }
             },
             error => {
                 console.log(<any>error);
             }
         );
     }
}