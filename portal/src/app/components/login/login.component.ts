import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
    public title; string;

    cinstructir(){
        this.title = 'SingIn'
    }

    ngOnInit(){
        console.log('Login component is load')
    }
}