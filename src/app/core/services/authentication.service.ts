import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Login } from 'src/app/shared/models/login';
import { ApiService } from './api.service';
import { JwtStorageService } from './jwt-storage.service';
//import {JwtHelperService} from "@auth0/angular-jwt";
import { User } from 'src/app/shared/models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user:User;

  private currentLoggedInUserSubject = new BehaviorSubject<User>({} as User);
  public currentLoggedInUser= this.currentLoggedInUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiServeice: ApiService, 
    private jwtStorageService: JwtStorageService,
    //private jwthelper: JwtHelperService
    ) { }

  //!login component will call this
  login(userLogin:Login):Observable<boolean>{
    return this.apiServeice.create('account/login',userLogin)
    .pipe(map(response=>{
      if (response) {
        console.log(response);
        // once we get the JWT token from API,  Angular will save that token in local storage
        this.jwtStorageService.saveToken(response.token);
        this.populateLoggedInUserInfo();
        //this.decodeJWT();
        // then decode that token and fill up User object
        return true;
        }
        return false
      }
    ))
  }

  public populateLoggedInUserInfo(){
    if (this.jwtStorageService.getToken()) {
      const token = this.jwtStorageService.getToken();
      const decodedToken = this.decodeJWT();
      this.currentLoggedInUserSubject.next(decodedToken);
      this.isAuthenticatedSubject.next(true);
    }
  }

  private decodeJWT():User|null {
    //first get the token from local storage
    const token = this.jwtStorageService.getToken();
    //check token is not null and not expired
    if (!token || new JwtHelperService().isTokenExpired(token)) {
      console.log("token is expired")
      return null;
    }
    //decode the token and create the user object
    const decodedToken = new JwtHelperService().decodeToken(token);
    
    console.log("decodedToken",decodedToken)
    
    this.user = decodedToken;
    console.log("User",this.user)
    return this.user;
  }

  //!signup component will call this
  register(){
    
  }

  //! header logout button will call this
  logout(){
    //remove token from local storage
    this.jwtStorageService.destroyToken();
    //clear the behavior subjects
    //set current user subject to empty object
    this.currentLoggedInUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }
}
