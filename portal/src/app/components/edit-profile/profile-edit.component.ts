import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User }from '../../models/user';
import { UserService} from '../../services/user.service';
import { GLOBAL } from '../../services/global'; 
import { UploadService} from '../../services/upload.service';

@Component({
    selector: 'edit-profile',
    templateUrl: './profile-edit.component.html',
    providers: [UserService, UploadService]
})
export class EditProfileComponent implements OnInit{
    public title:string;
    public editUser: User;
    public identity;
    public token;
    public status: string;
    public url: string;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService:UserService,
        private myUploadService: UploadService
    ){
        this.title = "Edit Profile";
        this.identity = this.myUserService.getIdentity();
        this.editUser = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('Profile Edit Component Load!!');
        //this.identity = this.myUserService.getIdentity();
    }
    onSubmit(){
        //console.log(this.editUser);
        this.myUserService.updateUser(this.editUser).subscribe(
          response => {
              if (!response.user){
                  this.status = 'error';
              } else {
                this.status = 'success';
                localStorage.setItem ( 'identity', JSON.stringify(this.editUser));
                this.identity = this.editUser;

                //subir imagen
                this.myUploadService.makeFileRequest(this.url+'user/upload-image-user/'+ this.editUser._id, [] , this.fileToUpload, this.token, 'image')
                                                .then((result:any) => {
                                                    console.log(result);
                                                    this.editUser.image = result.user.image;
                                                    localStorage.setItem ( 'identity', JSON.stringify(this.editUser));
                                                });
              }

          } ,
          error => {
              var errorMessage = <any>error;
              console.log(errorMessage.error);

              if(errorMessage != null){
                  this.status = 'error';
              }
          }
        );
    }
    public fileToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        console.log(this.fileToUpload);
    }
}