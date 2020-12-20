import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
    public title:string;
    public loginUser: User;
    public loginStatus: string;
    public identity;
    public token;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserServices: UserService
        
    ){
        this.title = 'SingIn';
        this.loginStatus = 'none';
        this.loginUser = new User('','','','','','','ROLE_USER','');
    }

    ngOnInit(){
        console.log('Login component is load')
    }
    loginSubmit(){
        this.myUserServices.login(this.loginUser).subscribe(
            response => {
                this.identity = response.user;
                if(!this.identity || !this.identity._id){
                    this.loginStatus = 'error';
                }else{
                    localStorage.setItem('identity',JSON.stringify(this.identity));
                    this.getToken();
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.loginStatus = 'error';
                }
            }
        );    
    }

    getToken(){
        this.myUserServices.login(this.loginUser, 'true').subscribe(
            response => {
                this.token = response.token;
                if(this.token.length <= 0){
                    this.loginStatus = 'error';
                }else{
                    localStorage.setItem('token',JSON.stringify(this.token));
                    //this.getCounters();
                    this.myRouter.navigate(['/home']);
                }
            },
            error =>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.loginStatus = 'error';
                }
            }
        );
    }
    
    getCounters(){
        this.myUserServices.getCounters(this.identity._id).subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));
                this.loginStatus = 'success' 
                this.myRouter.navigate(['/home']);
            },
            error => {
                console.log(<any>error);
            }
        )
    }
}