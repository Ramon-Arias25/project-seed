import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Message } from '../models/message';

@Injectable()
export class MessageService{
    public url: string;

    constructor(
        private _http: HttpClient
        ){
        this.url = GLOBAL.url;
    }

    addMessage(token, message):Observable<any>{
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-type','application/json')
                                        .set('Authorization',token);
        return this._http.post(this.url+'send-message',params, { headers:headers });
    }

    getInbox(token, page):Observable<any>{
        let headers = new HttpHeaders().set('Content-type','application/json')
                                        .set('Authorization',token);
        return this._http.get(this.url+'inbox-messages/'+ page, { headers:headers });
    }
    
    getOutbox(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-type','application/json')
                                        .set('Authorization',token);
        return this._http.get(this.url+'outbox-messages/'+ page, { headers:headers });
    }
}